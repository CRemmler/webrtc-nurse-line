class CreatePlayers < ActiveRecord::Migration
  def change
    create_table :players do |t|
      t.string :icon

      t.timestamps
    end
  end
end
