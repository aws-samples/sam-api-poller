build-PayloadProcessorFunction:
	$(MAKE) HANDLER=src/handlers/payload-processor.ts build-lambda

build-WorkflowPreparePollerJobFunction:
	$(MAKE) HANDLER=src/handlers/workflow-prepare-poller-job.ts build-lambda

build-WorkflowFetchPayloadFunction:
	$(MAKE) HANDLER=src/handlers/workflow-fetch-payload.ts build-lambda

build-PayloadGeneratorFunction:
	$(MAKE) HANDLER=src/handlers/payload-generator.ts build-lambda

build-JobsGetJobSummaryFunction:
	$(MAKE) HANDLER=src/handlers/jobs-get-job-summary.ts build-lambda

build-lambda:
	npm install --quiet
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-lambda.json
	npm run build -- --build tsconfig-lambda.json
	cp -r dist/. "$(ARTIFACTS_DIR)/"

build-LambdaDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --quiet --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" "$(ARTIFACTS_DIR)/nodejs/package-lock.json"