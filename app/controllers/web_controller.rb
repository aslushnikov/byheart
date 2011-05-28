class WebController < ApplicationController
  before_filter :authenticate_user!
  layout "webclient"
  def home
  end

  def train_orig
    @words = current_user.words
    @train_mode = "orig"
    render :train
  end

  def train_trans
    @words = current_user.words
    @train_mode = "trans"
    render :train
  end
end
