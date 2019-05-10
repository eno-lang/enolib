# frozen_string_literal: true

require 'json'

$LOAD_PATH.unshift('./lib')
require 'enolib'

SAMPLES = {
  'configuration' => File.read('performance/samples/configuration.eno'),
  'content' => File.read('performance/samples/content.eno'),
  'hierarchy' => File.read('performance/samples/hierarchy.eno'),
  'invoice' => File.read('performance/samples/invoice.eno'),
  'journey' => File.read('performance/samples/journey.eno'),
  'post' => File.read('performance/samples/post.eno')
}.freeze

@analysis =
  begin
    JSON.parse(File.read('performance/analysis.json'))
  rescue Errno::ENOENT
    {}
  end

@reference = @analysis.empty? ? nil : @analysis['reference']
@modifications = { _evaluated: Time.now }

SAMPLES.each do |name, content|
  before = Time.now
  seconds = 0
  iterations = 0

  while seconds < 4
    1000.times { Enolib.parse(content) }
    iterations += 1000
    seconds = Time.now - before
  end

  ips = (iterations / seconds).to_i
  delta = @reference ? ips - @reference[name]['ips'] : 0

  if delta == 0
    change = '~0 ips (same)'
  elsif delta.positive?
    factor = @reference ? (ips / @reference[name]['ips'].to_f).round(3) : 0
    change = "+#{delta} ips (#{factor}× faster)"
  else
    factor = @reference ? (@reference[name]['ips'] / ips.to_f).round(3) : 0
    change = "#{delta} ips (#{factor}× slower)"
  end

  @modifications[name] = {
    change: change,
    ips: ips
  }

  puts "#{change} [#{name}]"
end

@analysis['modifications'] = @modifications

File.write('performance/analysis.json', JSON.pretty_generate(@analysis))
