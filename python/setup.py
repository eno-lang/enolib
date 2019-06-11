from setuptools import find_packages, setup

with open('README.md', 'r') as file:
    long_description = file.read()

setup(author='Simon Repp',
      author_email='simon@fdpl.io',
      classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Topic :: Software Development :: Libraries"
      ],
      description='The eno standard library',
      long_description=long_description,
      long_description_content_type="text/markdown",
      license='MIT',
      name='enolib',
      packages=find_packages(exclude=['performance', 'performance.*', 'tests', 'tests.*']),
      url='https://eno-lang.org/enolib/',
      version='0.7.0',
      zip_safe=False)
