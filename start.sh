#!/usr/bin/env bash
export FLASK_APP=app
export FLASK_ENV=development
export FLASK_RUN_PORT=5000
python3 -m venv venv
. venv/bin/activate
flask run