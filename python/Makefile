build:
		python3 setup.py sdist bdist_wheel

clean:
		rm -rf build/ dist/ enolib.egg-info

coverage:
		pytest --cov=enolib --cov-report=html

publish:
		twine upload ./dist/*

test-publish:
		twine upload -r testpypi ./dist/*
