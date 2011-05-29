class WebController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_words
  layout "webclient"
  def home
  end

  def train_orig
    @train_mode = "orig"
    render :train
  end

  def train_trans
    @train_mode = "trans"
    render :train
  end

  protected
    def load_words
      @words = current_user.words
    end
end
