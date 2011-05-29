class Word < ActiveRecord::Base
  belongs_to :user
  after_initialize :default_values

  protected
    def default_values 
      self.orig ||= ""
      self.trans ||= ""
      self.sample ||= ""
      self.orig_show ||= 0
      self.orig_succ ||= 0
      self.trans_show ||= 0
      self.trans_succ ||= 0
    end
end
