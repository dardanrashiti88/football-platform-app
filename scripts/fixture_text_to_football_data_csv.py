#!/usr/bin/env python3
"""
Convert "fixture list" text (like worldfootball.net / similar dumps) into a Football-Data-style CSV:
Date,HomeTeam,AwayTeam,FTHG,FTAG,FTR,HTHG,HTAG,HTR,...

Usage:
  python3 scripts/fixture_text_to_football_data_csv.py < input.txt > season-2526.csv
  python3 scripts/fixture_text_to_football_data_csv.py --in input.txt --out season-2526.csv
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import re
import sys
from typing import Iterable, Iterator, Optional


MONTHS = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12,
}


DATE_HEADER_RE = re.compile(
    r"^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+([A-Za-z]{3})/(\d{1,2})(?:\s+(\d{4}))?\s*$"
)

LEADING_TIME_RE = re.compile(r"^\d{1,2}\.\d{2}\s+")

SCORE_RE = re.compile(r"(\d+)\s*-\s*(\d+)(?:\s*\((\d+)\s*-\s*(\d+)\))?\s*$")


def iter_lines(text: str) -> Iterator[str]:
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        yield line


def infer_year(month: int) -> int:
    # Championship season 2025/26 in the provided format:
    # Aug-Dec -> 2025, Jan-May -> 2026
    return 2026 if month <= 5 else 2025


def fmt_date(d: dt.date) -> str:
    # Football-Data format: dd/mm/yy
    return d.strftime("%d/%m/%y")


def ftr_from_score(fthg: int, ftag: int) -> str:
    if fthg > ftag:
        return "H"
    if fthg < ftag:
        return "A"
    return "D"


def parse_fixture_text(text: str) -> list[list[str]]:
    rows: list[list[str]] = []
    current_date: Optional[dt.date] = None

    for line in iter_lines(text):
        # Skip obvious headers/comments
        if line.startswith(("=", "#", "»")):
            continue

        m_date = DATE_HEADER_RE.match(line)
        if m_date:
            mon_abbr = m_date.group(2)
            day = int(m_date.group(3))
            month = MONTHS.get(mon_abbr)
            if not month:
                continue
            year = int(m_date.group(4)) if m_date.group(4) else infer_year(month)
            current_date = dt.date(year, month, day)
            continue

        # Only treat lines with a " v " as match lines.
        if " v " not in line:
            continue

        if current_date is None:
            # Can't place the fixture on a date.
            continue

        # Remove leading kickoff time if present.
        line_wo_time = LEADING_TIME_RE.sub("", line).strip()
        if " v " not in line_wo_time:
            continue

        home_raw, right = line_wo_time.split(" v ", 1)
        home = home_raw.strip()
        right = right.strip()

        away = right
        fthg = ""
        ftag = ""
        ftr = ""
        hthg = ""
        htag = ""
        htr = ""

        if right.lower().endswith("[cancelled]"):
            away = right[: -len("[cancelled]")].strip()
        else:
            m_score = SCORE_RE.search(right)
            if m_score:
                away = right[: m_score.start()].strip()
                fthg_i = int(m_score.group(1))
                ftag_i = int(m_score.group(2))
                fthg = str(fthg_i)
                ftag = str(ftag_i)
                ftr = ftr_from_score(fthg_i, ftag_i)

                if m_score.group(3) is not None and m_score.group(4) is not None:
                    hthg_i = int(m_score.group(3))
                    htag_i = int(m_score.group(4))
                    hthg = str(hthg_i)
                    htag = str(htag_i)
                    htr = ftr_from_score(hthg_i, htag_i)

        if not home or not away:
            continue

        rows.append(
            [
                fmt_date(current_date),
                home,
                away,
                fthg,
                ftag,
                ftr,
                hthg,
                htag,
                htr,
                "",  # Referee
                "",  # HS
                "",  # AS
                "",  # HST
                "",  # AST
                "",  # HF
                "",  # AF
                "",  # HC
                "",  # AC
                "",  # HY
                "",  # AY
                "",  # HR
                "",  # AR
            ]
        )

    return rows


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--in", dest="in_path", help="Input text file path. If omitted, reads stdin.")
    parser.add_argument("--out", dest="out_path", help="Output CSV file path. If omitted, writes stdout.")
    args = parser.parse_args(argv)

    if args.in_path:
        text = open(args.in_path, "r", encoding="utf-8").read()
    else:
        text = sys.stdin.read()

    rows = parse_fixture_text(text)

    out = open(args.out_path, "w", newline="", encoding="utf-8") if args.out_path else sys.stdout
    try:
        writer = csv.writer(out)
        writer.writerow(
            [
                "Date",
                "HomeTeam",
                "AwayTeam",
                "FTHG",
                "FTAG",
                "FTR",
                "HTHG",
                "HTAG",
                "HTR",
                "Referee",
                "HS",
                "AS",
                "HST",
                "AST",
                "HF",
                "AF",
                "HC",
                "AC",
                "HY",
                "AY",
                "HR",
                "AR",
            ]
        )
        writer.writerows(rows)
    finally:
        if args.out_path:
            out.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
