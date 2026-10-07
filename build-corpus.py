"""Compatibility entry point: publication requires institutional approvals."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name("validate-corpus.py")),run_name="__main__")
