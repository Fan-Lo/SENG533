# SENG533
Performance evaluation of LLMs 

# Source Code
`final.js` contains the k6 script responsible for running a scenario with all prompts. `run_all_test.sh` is a bash script that allows sequentially execution of `final.js` with different LLM and different load conditions.

# Data
Raw K6 data (time-series) can be find the the `./data` folder, with each LLM run contained in its own csv. There are 4 csv time series in total, corresponding to DeepSeek run 1, run 2, and Llama run 1, run2. The raw data is analyzed and organized in a table and Student's T test was performed to analyze performrance difference. The analyzed data can be found in `summary.xlsx`.

# Data Visaulization
Graphical visualization is performed using Grafana, amd screenshots can be found in the submitted report.
