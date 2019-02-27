describe Enolib::Messages::En do
  Enolib::Messages::En.constants.each do |name|
    describe name do
      translation = Enolib::Messages::En.const_get(name)

      if translation.is_a?(Proc)
        it 'contains a dynamic translated message generator function' do
          parameters = Array.new(translation.parameters.length)
          generated_message = translation.call(*parameters)
          expect(generated_message).to be_a(String)
        end
      else
        it 'contains a static string translation' do
          expect(translation).to be_a(String)
        end
      end
    end
  end
end
