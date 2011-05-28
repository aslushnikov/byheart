class CreateWords < ActiveRecord::Migration
  def self.up
    create_table :words do |t|
      t.string :orig
      t.string :trans
      t.string :sample
      t.integer :orig_show
      t.integer :orig_succ
      t.integer :trans_show
      t.integer :trans_succ

      t.timestamps
    end
  end

  def self.down
    drop_table :words
  end
end
