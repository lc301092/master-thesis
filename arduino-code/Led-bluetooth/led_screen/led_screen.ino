#include <LiquidCrystal.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 8);

byte test[8] = {
  0b00010,
  0b01010,
  0b01110,
  0b00100,
  0b00100,
  0b01110,
  0b00100,
  0b00100
};

void setup(){
    lcd.begin(16, 2);
    lcd.setCursor(0,0) ; 
    lcd.createChar(1,test);
    lcd.write(1);
}

void loop(){
}
