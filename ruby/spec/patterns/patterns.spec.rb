require_relative './scenarios.rb'

MATCH_INDICES = Enolib::Grammar.constants
                            .select { |constant| constant.to_s.end_with?('_INDEX') }
                            .map { |constant| [Enolib::Grammar.const_get(constant), constant] }
                            .to_h

describe Enolib::Grammar do
  SCENARIOS.each do |scenario|
    scenario[:variants].each do |variant|
      context "with \"#{variant.gsub("\n", '\n')}\"" do
        match = Enolib::Grammar::REGEX.match(variant)

        if scenario[:captures]
          it 'matches' do
            expect(match).to be_truthy
          end

          MATCH_INDICES.each do |index, group|
            capture = scenario[:captures][index]

            if capture
              it "captures '#{capture}' in group #{group}" do
                expect(match[index]).to eq(capture)
              end
            else
              it "captures nothing in group #{group}" do
                expect(match[index]).to be nil
              end
            end
          end
        else
          it 'does not match' do
            expect(!match || match.begin(0) > 0).to be true
          end
        end
      end
    end
  end
end
