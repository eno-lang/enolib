# frozen_string_literal: true

describe 'Global blackbox test' do
  context 'with a minimal sample' do
    document = Enolib.parse('language: eno')

    it 'produces correct raw output' do
      expect(document.raw).to match_snapshot
    end
  end

  context 'with a complex sample' do
    input = File.read(File.join(__dir__, '../parser/samples/complex.eno'))

    document = Enolib.parse(input)

    it 'produces correct raw output' do
      expect(document.raw).to match_snapshot
    end

    context 'querying different fields' do
      it 'returns the shopping list correctly' do
        expect(document.list('Shopping List').required_string_values).to eq(['Apples', 'Oranges'])
      end

      it 'returns the date correctly' do
        expect(document.field('Date').required_string_value).to eq('1st of November in the year 2017')
      end

      it 'returns the "I" correctly' do
        body = document.section('Body')
        limbs = body.section('Limbs')
        left_arm = limbs.section('Left Arm')

        expect(left_arm.field('I').required_string_value).to eq('append allthe things')
      end
    end
  end
end
