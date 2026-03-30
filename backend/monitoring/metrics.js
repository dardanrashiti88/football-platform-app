const processStartMs = Date.now();
const durationBuckets = [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];

const requestTotals = new Map();
const requestDurations = new Map();

let activeRequests = 0;

const escapeLabelValue = (value) =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"');

const normalizePath = (value) =>
  String(value || '/')
    .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, ':id')
    .replace(/\/\d+(?=\/|$)/g, '/:id');

const buildKey = (labels) => JSON.stringify(labels);

const buildLabelString = (labels) =>
  Object.entries(labels)
    .map(([key, value]) => `${key}="${escapeLabelValue(value)}"`)
    .join(',');

const recordRequest = ({ serviceName, method, route, statusCode, durationSeconds }) => {
  const labels = {
    service: serviceName,
    method,
    route,
    status_code: String(statusCode)
  };
  const key = buildKey(labels);

  const requestTotal = requestTotals.get(key) || { labels, count: 0 };
  requestTotal.count += 1;
  requestTotals.set(key, requestTotal);

  const existingDuration =
    requestDurations.get(key) ||
    {
      labels,
      count: 0,
      sum: 0,
      buckets: durationBuckets.map((le) => ({ le, count: 0 }))
    };

  existingDuration.count += 1;
  existingDuration.sum += durationSeconds;
  existingDuration.buckets.forEach((bucket) => {
    if (durationSeconds <= bucket.le) {
      bucket.count += 1;
    }
  });
  requestDurations.set(key, existingDuration);
};

const createMetricsMiddleware = (serviceName) => (req, res, next) => {
  if (req.path === '/metrics') {
    next();
    return;
  }

  activeRequests += 1;
  const started = process.hrtime.bigint();

  res.on('finish', () => {
    activeRequests = Math.max(0, activeRequests - 1);
    const durationSeconds = Number(process.hrtime.bigint() - started) / 1e9;
    const route =
      req.route?.path
        ? `${req.baseUrl || ''}${req.route.path}`
        : `${req.baseUrl || ''}${normalizePath(req.path)}`;

    recordRequest({
      serviceName,
      method: req.method,
      route,
      statusCode: res.statusCode,
      durationSeconds
    });
  });

  next();
};

const renderMetrics = (serviceName) => {
  const rss = process.memoryUsage().rss;
  const heapUsed = process.memoryUsage().heapUsed;
  const uptimeSeconds = process.uptime();
  const startTimeSeconds = Math.floor(processStartMs / 1000);
  const cpuUsage = process.cpuUsage();
  const cpuSecondsTotal = (cpuUsage.user + cpuUsage.system) / 1e6;

  const lines = [
    '# HELP fod_app_info Static application info.',
    '# TYPE fod_app_info gauge',
    `fod_app_info{service="${escapeLabelValue(serviceName)}"} 1`,
    '# HELP fod_active_requests Current in-flight HTTP requests.',
    '# TYPE fod_active_requests gauge',
    `fod_active_requests{service="${escapeLabelValue(serviceName)}"} ${activeRequests}`,
    '# HELP fod_process_uptime_seconds Process uptime in seconds.',
    '# TYPE fod_process_uptime_seconds gauge',
    `fod_process_uptime_seconds{service="${escapeLabelValue(serviceName)}"} ${uptimeSeconds.toFixed(3)}`,
    '# HELP fod_process_start_time_seconds Process start time since unix epoch in seconds.',
    '# TYPE fod_process_start_time_seconds gauge',
    `fod_process_start_time_seconds{service="${escapeLabelValue(serviceName)}"} ${startTimeSeconds}`,
    '# HELP fod_process_resident_memory_bytes Resident memory size in bytes.',
    '# TYPE fod_process_resident_memory_bytes gauge',
    `fod_process_resident_memory_bytes{service="${escapeLabelValue(serviceName)}"} ${rss}`,
    '# HELP fod_process_heap_used_bytes V8 heap usage in bytes.',
    '# TYPE fod_process_heap_used_bytes gauge',
    `fod_process_heap_used_bytes{service="${escapeLabelValue(serviceName)}"} ${heapUsed}`,
    '# HELP fod_process_cpu_seconds_total Total CPU time consumed by the process.',
    '# TYPE fod_process_cpu_seconds_total counter',
    `fod_process_cpu_seconds_total{service="${escapeLabelValue(serviceName)}"} ${cpuSecondsTotal.toFixed(6)}`,
    '# HELP fod_http_requests_total Total HTTP requests handled.',
    '# TYPE fod_http_requests_total counter'
  ];

  requestTotals.forEach(({ labels, count }) => {
    lines.push(`fod_http_requests_total{${buildLabelString(labels)}} ${count}`);
  });

  lines.push('# HELP fod_http_request_duration_seconds Request duration histogram.');
  lines.push('# TYPE fod_http_request_duration_seconds histogram');

  requestDurations.forEach(({ labels, buckets, count, sum }) => {
    buckets.forEach((bucket) => {
      lines.push(
        `fod_http_request_duration_seconds_bucket{${buildLabelString({
          ...labels,
          le: bucket.le
        })}} ${bucket.count}`
      );
    });
    lines.push(
      `fod_http_request_duration_seconds_bucket{${buildLabelString({
        ...labels,
        le: '+Inf'
      })}} ${count}`
    );
    lines.push(`fod_http_request_duration_seconds_sum{${buildLabelString(labels)}} ${sum.toFixed(6)}`);
    lines.push(`fod_http_request_duration_seconds_count{${buildLabelString(labels)}} ${count}`);
  });

  return `${lines.join('\n')}\n`;
};

module.exports = {
  createMetricsMiddleware,
  renderMetrics
};
