int sensorPin = 0; 
char testChar = 'h';
 
void setup() { 
  Serial.begin(9600); // Default communication rate of the Bluetooth module 
} 

void loop() { 
 // int sensorVal = analogRead(sensorPin); //read the input from the sensor 
 // float voltage = (sensorVal/1024.0) * 5; //convert the input into a voltage 
  //float temperatureCelsius = (voltage - .5) * 100; //convert voltage into temperature 

  
  
  if(Serial.available() > 0) {  
  Serial.println(testChar); //print results in bluetooth terminal
  delay(100);
 }
}
