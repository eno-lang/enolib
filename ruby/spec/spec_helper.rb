require 'deep-cover'

require 'enolib'
require 'fileutils'
require 'rspec/cheki'

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.pattern = '**/*.spec.rb'
  config.shared_context_metadata_behavior = :apply_to_host_groups
  config.warnings = true

  # TODO: DRY up and re-use parse_error/validation_error custom matcher code

  RSpec::Matchers.define :raise_parse_error_matching_snapshot do
    supports_block_expectations

    match do |proc|
      begin
        proc.call
      rescue Enolib::ParseError => e
        snapshot = <<~DOC
          type: #{e.class}
          text: #{e.text}

          -- snippet
          #{e.snippet}
          -- snippet

          cursor: [#{e.cursor}]
          selection: [#{e.selection[0]}] => [#{e.selection[1]}]
        DOC

        example_path = RSpec.current_example.file_path

        snapshots_directory = File.join(File.dirname(example_path), 'snapshots')
        FileUtils.mkdir_p(snapshots_directory) unless File.directory?(snapshots_directory)

        snapshot_path = File.join(snapshots_directory, File.basename(example_path, '.rb') + '.eno')
        File.write(snapshot_path, snapshot)

        true
      end
    end

    failure_message do |proc|
      'TODO'
    end
  end

  RSpec::Matchers.define :raise_validation_error_matching_snapshot do
    supports_block_expectations

    match do |proc|
      begin
        proc.call
      rescue Enolib::ValidationError => e
        snapshot = <<~DOC
          type: #{e.class}
          text: #{e.text}

          -- snippet
          #{e.snippet}
          -- snippet

          cursor: [#{e.cursor}]
          selection: [#{e.selection[0]}] => [#{e.selection[1]}]
        DOC

        example_path = RSpec.current_example.file_path

        snapshots_directory = File.join(File.dirname(example_path), 'snapshots')
        FileUtils.mkdir_p(snapshots_directory) unless File.directory?(snapshots_directory)

        snapshot_path = File.join(snapshots_directory, File.basename(example_path, '.rb') + '.eno')
        File.write(snapshot_path, snapshot)

        true
      end
    end

    failure_message do |proc|
      'TODO'
    end
  end
end

# TODO: Ultimately completely replace these interceptors below

def intercept_parse_error
  begin
    yield
  rescue Enolib::ParseError => e
    return e
  end
end

def intercept_validation_error
  begin
    yield
  rescue Enolib::ValidationError => e
    return e
  end
end
