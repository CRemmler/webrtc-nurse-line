class HomeController < ApplicationController

  def index
  end

  def session
    @sessionid = params[:sessionid]


    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @players }
    end

  end

  def url
    @urlimage = 'www.google.png'
    @encodedurl = params[:encodedurl]
  
   @targeturl = @encodedurl.gsub("+++",".") 
   @targeturl = @targeturl.gsub("---","/") 

#   @targetimage = @targeturl + ".png"
   @targetimage = @encodedurl + ".png"

#   snap = WebSnap::Snapper.new(@targeturl, :format => 'png')

#  snap = WebSnap::Snapper.new('www.google.com', :format => 'png')

   # Get the binary image data
   # png = snap.to_bytes

   # Save the png to a file
#   file = snap.to_file('/var/www/web_apps/webcrayons/app/assets/images/urls/' + @targetimage)
#   file = snap.to_file('/var/www/web_apps/webcrayons/app/assets/images/test.png')
#file = snap.to_file('thisone.png')

#  exec('./wkhtmltoimage-amd64 ' + @targeturl + ' /var/www/web_apps/webcrayons/app/assets/images/' + @targetimage)
# exec('wkhtmltoimage www.google.com /var/www/web_apps/webcrayons/app/assets/images/urls/www.google.png')

#@kit = IMGKit.new(@targeturl)
#file = kit.to_file('/var/www/web_apps/webcrayons/app/assets/images/urls/cat.png')
#    render :partial => "url", :locals => {:encodedurl => @encodedurl }
#format.png do
#  send_data(@kit.to_png, :type => "image/png", :disposition => 'inline')
#end

@kit = IMGKit.new(@targeturl)
#@kit = IMGKit.new('http://www.google.com')
respond_to do |format|
  format.html  
  format.png do
    send_data(@kit.to_png, :type => "image/png", :disposition => 'inline')
  end
end



  end
 
end
