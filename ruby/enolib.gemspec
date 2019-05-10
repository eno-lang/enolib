# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.add_development_dependency('deep-cover', '~> 0.7.1')
  spec.add_development_dependency('rspec', '~> 3.8')
  spec.add_development_dependency('rspec-cheki', '0.1.0')
  spec.add_development_dependency('rubocop')
  spec.add_development_dependency('rubocop-performance')
  spec.author = 'Simon Repp'
  spec.description = 'The cross-language eno standard library'
  spec.email = 'simon@fdpl.io'
  spec.files = `git ls-files -z lib LICENSE.txt README.md`.split("\0")
  spec.homepage = 'https://eno-lang.org/enolib/'
  spec.license = 'MIT'
  spec.metadata = {
    'bug_tracker_uri' => 'https://github.com/eno-lang/enolib/issues',
    'changelog_uri' => 'https://github.com/eno-lang/enolib/blob/master/CHANGELOG.md',
    'documentation_uri' => 'https://eno-lang.org/enolib/',
    'homepage_uri' => 'https://eno-lang.org/enolib/',
    'source_code_uri' => 'https://github.com/eno-lang/enolib/'
  }
  spec.name = 'enolib'
  spec.required_ruby_version = '>= 2.4.0'
  spec.summary = 'The cross-language eno standard library'
  spec.version = '0.5.0'
end
