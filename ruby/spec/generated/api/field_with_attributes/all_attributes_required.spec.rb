# frozen_string_literal: true

describe 'Querying a missing attribute on a field with attributes when all attributes are required' do
  it 'raises the expected ValidationError' do
    input = 'field:'

    begin
      field = Enolib.parse(input).field('field')
      
      field.all_attributes_required
      field.attribute('attribute')
    rescue Enolib::ValidationError => error
      text = 'The attribute \'attribute\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
    end
  end
end

describe 'Querying a missing attribute on a field with attributes when all requiring all attributes is explicitly enabled' do
  it 'raises the expected ValidationError' do
    input = 'field:'

    begin
      field = Enolib.parse(input).field('field')
      
      field.all_attributes_required(true)
      field.attribute('attribute')
    rescue Enolib::ValidationError => error
      text = 'The attribute \'attribute\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
    end
  end
end

describe 'Querying a missing attribute on a field with attributes when requiring all attributes is explicitly disabled' do
  it 'produces the expected result' do
    input = 'field:'
    
    field = Enolib.parse(input).field('field')
    
    field.all_attributes_required(false)
    field.attribute('attribute')
    
    expect('it passes').to be_truthy
  end
end

describe 'Querying a missing attribute on a field with attributes when requiring all attributes is enabled and disabled again' do
  it 'produces the expected result' do
    input = 'field:'
    
    field = Enolib.parse(input).field('field')
    
    field.all_attributes_required(true)
    field.all_attributes_required(false)
    field.attribute('attribute')
    
    expect('it passes').to be_truthy
  end
end

describe 'Querying a missing but explicitly optional attribute on a field with attributes when requiring all attributes is enabled' do
  it 'produces the expected result' do
    input = 'field:'
    
    field = Enolib.parse(input).field('field')
    
    field.all_attributes_required
    field.optional_attribute('attribute')
    
    expect('it passes').to be_truthy
  end
end