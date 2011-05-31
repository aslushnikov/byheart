namespace :server do
  desc "Get users list"
  task :users, :needs => [:environment] do |t, args|
    all = User.find(:all)
    all.each do |u|
      puts "#{u.name}\t#{u.email}"
    end
  end
end
