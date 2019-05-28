describe 'register (with invalid arguments)' do
  context "trying to register 'string'" do
    it 'raises an error' do
      expect { Enolib.register(string: proc { |value| value }) }.to raise_error(
        ArgumentError,
        "You cannot register 'string' as a type/loader with enolib as this conflicts with the native string type accessors."
      )
    end
  end
end
