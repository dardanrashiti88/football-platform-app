resource "docker_network" "fod" {
  name = "${local.project_name}-network"
}

resource "docker_volume" "backend_data" {
  name = "${local.project_name}-backend-data"
}

resource "docker_volume" "prometheus_data" {
  name = "${local.project_name}-prometheus-data"
}

resource "docker_volume" "grafana_data" {
  name = "${local.project_name}-grafana-data"
}

resource "docker_volume" "alertmanager_data" {
  name = "${local.project_name}-alertmanager-data"
}

resource "docker_image" "frontend" {
  name         = local.image_names.frontend
  keep_locally = true

  build {
    context    = local.repo_root
    dockerfile = "frontend/Dockerfile"
  }
}

resource "docker_image" "backend" {
  name         = local.image_names.backend
  keep_locally = true

  build {
    context    = local.repo_root
    dockerfile = "backend/Dockerfile"
  }
}

resource "docker_image" "db_api" {
  name         = local.image_names.db_api
  keep_locally = true

  build {
    context    = local.repo_root
    dockerfile = "db-api/Dockerfile"
  }
}

resource "docker_image" "blackbox" {
  name         = local.official_images.blackbox
  keep_locally = true
}

resource "docker_image" "prometheus" {
  name         = local.official_images.prometheus
  keep_locally = true
}

resource "docker_image" "alertmanager" {
  name         = local.official_images.alertmanager
  keep_locally = true
}

resource "docker_image" "grafana" {
  name         = local.official_images.grafana
  keep_locally = true
}

resource "docker_container" "db_api" {
  name     = "${local.project_name}-db-api"
  image    = docker_image.db_api.image_id
  restart  = "unless-stopped"
  must_run = true
  env      = local.db_api_env

  ports {
    internal = 3010
    external = local.ports.db_api
  }

  networks_advanced {
    name    = docker_network.fod.name
    aliases = ["db-api"]
  }
}

resource "docker_container" "backend" {
  name     = "${local.project_name}-backend"
  image    = docker_image.backend.image_id
  restart  = "unless-stopped"
  must_run = true
  env      = local.backend_env

  ports {
    internal = 3002
    external = local.ports.backend
  }

  volumes {
    volume_name    = docker_volume.backend_data.name
    container_path = "/data"
  }

  networks_advanced {
    name    = docker_network.fod.name
    aliases = ["backend"]
  }

  depends_on = [docker_container.db_api]
}

resource "docker_container" "frontend" {
  name     = "${local.project_name}-frontend"
  image    = docker_image.frontend.image_id
  restart  = "unless-stopped"
  must_run = true

  ports {
    internal = 80
    external = local.ports.frontend
  }

  networks_advanced {
    name    = docker_network.fod.name
    aliases = ["frontend"]
  }

  depends_on = [
    docker_container.backend,
    docker_container.db_api
  ]
}

resource "docker_container" "blackbox" {
  name     = "${local.project_name}-blackbox-exporter"
  image    = docker_image.blackbox.image_id
  restart  = "unless-stopped"
  must_run = true
  command  = ["--config.file=/etc/blackbox_exporter/config.yml"]

  ports {
    internal = 9115
    external = local.ports.blackbox
  }

  mounts {
    target    = "/etc/blackbox_exporter/config.yml"
    source    = "${local.repo_root}/monitoring/blackbox/blackbox.yml"
    type      = "bind"
    read_only = true
  }

  networks_advanced {
    name    = docker_network.fod.name
    aliases = ["blackbox-exporter"]
  }
}

resource "docker_container" "alertmanager" {
  name       = "${local.project_name}-alertmanager"
  image      = docker_image.alertmanager.image_id
  restart    = "unless-stopped"
  must_run   = true
  env        = local.alertmanager_env
  entrypoint = ["/bin/sh", "/etc/alertmanager/bootstrap.sh"]

  ports {
    internal = 9093
    external = local.ports.alertmanager
  }

  volumes {
    volume_name    = docker_volume.alertmanager_data.name
    container_path = "/alertmanager"
  }

  mounts {
    target    = "/etc/alertmanager/bootstrap.sh"
    source    = "${local.repo_root}/monitoring/alertmanager/bootstrap.sh"
    type      = "bind"
    read_only = true
  }

  mounts {
    target    = "/etc/alertmanager/alertmanager.yml.template"
    source    = "${local.repo_root}/monitoring/alertmanager/alertmanager.yml.template"
    type      = "bind"
    read_only = true
  }

  networks_advanced {
    name    = docker_network.fod.name
    aliases = ["alertmanager"]
  }
}

resource "docker_container" "prometheus" {
  name     = "${local.project_name}-prometheus"
  image    = docker_image.prometheus.image_id
  restart  = "unless-stopped"
  must_run = true
  command = [
    "--config.file=/etc/prometheus/prometheus.yml",
    "--storage.tsdb.path=/prometheus",
    "--web.enable-lifecycle"
  ]

  ports {
    internal = 9090
    external = local.ports.prometheus
  }

  volumes {
    volume_name    = docker_volume.prometheus_data.name
    container_path = "/prometheus"
  }

  mounts {
    target    = "/etc/prometheus/prometheus.yml"
    source    = "${local.repo_root}/monitoring/prometheus/prometheus.yml"
    type      = "bind"
    read_only = true
  }

  mounts {
    target    = "/etc/prometheus/alerts.yml"
    source    = "${local.repo_root}/monitoring/prometheus/alerts.yml"
    type      = "bind"
    read_only = true
  }

  networks_advanced {
    name    = docker_network.fod.name
    aliases = ["prometheus"]
  }

  depends_on = [
    docker_container.frontend,
    docker_container.backend,
    docker_container.db_api,
    docker_container.blackbox,
    docker_container.alertmanager
  ]
}

resource "docker_container" "grafana" {
  name     = "${local.project_name}-grafana"
  image    = docker_image.grafana.image_id
  restart  = "unless-stopped"
  must_run = true
  env      = local.grafana_env

  ports {
    internal = 3000
    external = local.ports.grafana
  }

  volumes {
    volume_name    = docker_volume.grafana_data.name
    container_path = "/var/lib/grafana"
  }

  mounts {
    target    = "/etc/grafana/provisioning/datasources"
    source    = "${local.repo_root}/monitoring/grafana/provisioning/datasources"
    type      = "bind"
    read_only = true
  }

  mounts {
    target    = "/etc/grafana/provisioning/dashboards"
    source    = "${local.repo_root}/monitoring/grafana/provisioning/dashboards"
    type      = "bind"
    read_only = true
  }

  networks_advanced {
    name    = docker_network.fod.name
    aliases = ["grafana"]
  }

  depends_on = [docker_container.prometheus]
}
