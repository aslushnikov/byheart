class WebController < ApplicationController
  before_filter :authenticate_user!
  layout "webclient"
  def home
  end

end
