IMGKit.configure do |config|
  config.wkhtmltoimage = '/home/AUSTIN/cmr437/bin/wkhtmltoimage'
  config.default_options = {
    :quality => 60
  }
  config.default_format = :png
end
