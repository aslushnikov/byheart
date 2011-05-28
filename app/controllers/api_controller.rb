class ApiController < ApplicationController
  before_filter :forbid_user!

  def check_auth
    head :ok 
  end

  def all_words
    render :json => current_user.words 
  end

  def add_words
    begin
      words = ActiveSupport::JSON.decode(request.raw_post) 
      if !words.is_a? Array
        raise "Bad format!"
      end
      out = []
      words.each do |word|
        if !word.is_a? Hash
          raise "Bad format!"
        end
        w = Word.new(word)
        out << w
        current_user.words << w
      end
      render :json => out
    rescue
      head :bad_request and return
    end
  end

  def delete
    w = Word.find_by_id(params[:id])
    # check
    head :not_found and return if w.nil?
    if w.user == current_user
      w.destroy and head :ok
    else
      head :forbidden
    end
  end

  def commit_stats
    begin
      stats = ActiveSupport::JSON.decode(request.raw_post) 
      if !stats.is_a? Array
        raise "Bad format!"
      end
      words = []
      stats.each do |word_stat|
        if !word_stat.is_a? Hash
          raise "Bad format!"
        end
        w = Word.find_by_id(word_stat["id"])
        raise "Bad format!" if w.nil? 
        w.orig_show += word_stat["orig_show"].to_i
        w.orig_succ += word_stat["orig_succ"].to_i
        w.trans_show += word_stat["trans_show"].to_i
        w.trans_succ += word_stat["trans_succ"].to_i
        words << w
      end
      words.each { |w| w.save }
      render :json => words
    rescue
      head :bad_request and return
    end
  end

  protected
    def forbid_user!
      if !user_signed_in?
        head :unauthorized
      end
    end
end
