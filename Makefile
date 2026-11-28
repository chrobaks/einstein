.PHONY: help lint test serve

help:
	@printf '%s\n' \
	  'make lint  - Check all PHP files for syntax errors' \
	  'make test  - Run the solution variant integration test' \
	  'make serve - Start the PHP development server at http://127.0.0.1:8000'

lint:
	@find backend tests -type f -name '*.php' -print0 | xargs -0 -n1 php -l
	@php -l index.php

test:
	@php tests/solution_variant_test.php

serve:
	@php -S 127.0.0.1:8000 -t .
