class CsvController < ApplicationController
  before_filter :authenticate_user!
  require 'csv'

  def download 
    csv_string = FasterCSV.generate do |csv|
      csv << ["original", "translation", "sample"]
      current_user.words.each do |word|
        csv << [word.orig, word.trans, word.sample]
      end
    end
    send_data csv_string, :type => "text/plain",  
               :filename=>"words.csv", 
               :disposition => 'attachment'
  end

  def new
  end

  def upload
    loaded = params[:data].read 
    arr = FasterCSV.parse(loaded)
    headers = arr.shift(1) 
    arr.each do |row| 
      w = Word.new(:orig => row[0], :trans => row[1], :sample => row[2])
      current_user.words << w
    end
    redirect_to root_path    
  end

end
