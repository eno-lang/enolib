build:
		python3 setup.py sdist bdist_wheel

clean:
		rm -rf build/ dist/ enolib.egg-info

coverage:
		pytest --cov=enolib --cov-report=html

lint:
		pylint enolib -d R0801,W0311,C0301,C0111,C0330,R0904,R0401,C0103,C0304,C1801,R0911,R0916,W0511,R1705,C0326,R1702,R1720,R0903,R0914,R0915

publish:
		twine upload ./dist/*

test-publish:
		twine upload -r testpypi ./dist/*
