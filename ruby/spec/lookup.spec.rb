input = <<~DOC.strip
color: cyan
close:up
# notes
-- long
is
-- long
DOC

scenarios = [
  {
    arguments: [3], # 'o'
    key: 'color',
    range: :key
  },
  {
    arguments: [0, 3], # 'o'
    key: 'color',
    range: :key
  },
  {
    arguments: [6], # ' '
    key: 'color',
    range: :element_operator
  },
  {
    arguments: [0, 6], # ' '
    key: 'color',
    range: :element_operator
  },
  {
    arguments: [7], # 'c'
    key: 'color',
    range: :value
  },
  {
    arguments: [0, 7], # 'c'
    key: 'color',
    range: :value
  },
  {
    arguments: [18], # 'u'
    key: 'close',
    range: :value
  },
  {
    arguments: [1, 6], # 'u'
    key: 'close',
    range: :value
  },
  {
    arguments: [21], # '#'
    key: 'notes',
    range: :section_operator
  },
  {
    arguments: [2, 0], # '#'
    key: 'notes',
    range: :section_operator
  },
  {
    arguments: [27], # 's'
    key: 'notes',
    range: :key
  },
  {
    arguments: [2, 6], # 's'
    key: 'notes',
    range: :key
  },
  {
    arguments: [37],
    key: 'long', # 'i'
    range: :value
  },
  {
    arguments: [4, 0],
    key: 'long', # 'i'
    range: :value
  },
  {
    arguments: [45],
    key: 'long', # 'n'
    range: :key
  },
  {
    arguments: [5, 5],
    key: 'long', # 'n'
    range: :key
  }
]

describe Enolib::Section do
  describe '#lookup' do
    scenarios.each do |scenario|
      context "at (#{scenario[:arguments].join(', ')})" do
        lookup =
          if scenario[:arguments].length > 1
            Enolib.lookup(input, line: scenario[:arguments][0], column: scenario[:arguments][1])
          else
            Enolib.lookup(input, index: scenario[:arguments][0])
          end

        it "looks up element '#{scenario[:element]}'" do
          expect(lookup[:element].string_key).to eq(scenario[:key])
        end

        it "looks up token '#{scenario[:zone]}'" do
          expect(lookup[:range]).to eq(scenario[:range])
        end
      end
    end
  end
end
