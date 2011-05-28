class ApiController < ApplicationController
  before_filter :forbid_user!

  def check_auth
    head :ok 
  end

  protected
    def forbid_user!
      if !user_signed_in?
        head :unauthorized
      end
    end
end
