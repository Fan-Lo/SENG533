#!/bin/bash

# InfluxDB v2 credentials for xk6-influxdb
export K6_INFLUXDB_ADDR="http://localhost:8086"
export K6_INFLUXDB_BUCKET="perf_bucket"
export K6_INFLUXDB_ORGANIZATION="University of Calgary"
export K6_INFLUXDB_TOKEN="W2BqmKcJRULaCGX7zglKJVzMhxjT2dDW5Rkhca8cHM0CaOzExc6GKbNg1iU8YvIMiyAFFxqFyANAJKXDNEx7bg=="

MODELS=("llama3" "deepseek-r1:8b")
LOADS=(1 3 10)
SCRIPT="final.js"
K6_BIN="./k6"  # Use your xk6-influxdb-built binary here
INFLUX_OUTPUT="-o xk6-influxdb"

# Create logs directory if it doesn't exist
mkdir -p logs

for model in "${MODELS[@]}"; do
    echo "============================"
    echo ">>> Starting tests for model: $model"
    echo "============================"

    for vus in "${LOADS[@]}"; do
        echo ">>> [$(date)] Starting run: model=$model, vus=$vus"
        
        # Log each run to its own file inside logs/
        MODEL=$model VUS=$vus K6_LOG_LEVEL=info $K6_BIN run $INFLUX_OUTPUT $SCRIPT \
            2>&1 | tee -a logs/run_${model}_${vus}.log

        echo ">>> [$(date)] Completed run: model=$model, vus=$vus"
        echo ">>> Sleeping for 60 seconds before next batch..."
        sleep 60
    done

    echo ">>> [$(date)] Finished all tests for model: $model"
    echo ""
done

