class WebController < ApplicationController
  before_filter :authenticate_user!
  layout "webclient"
  def home
  end

  def train
    @words = current_user.words
  end
end
