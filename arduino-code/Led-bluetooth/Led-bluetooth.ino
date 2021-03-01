#include <SoftwareSerial.h>

SoftwareSerial BTserial(10, 11); // Setup of Bluetooth module on pins 10 (TXD) and 11 (RXD);

unsigned int timeout=0;
unsigned char state=0;
 
char val;         // variable to receive data from the serial port
int ledpin = 13;  // LED connected to pin 13

// Timer2 service
ISR(TIMER2_OVF_vect) { 
  TCNT2 = 0;
  timeout++;
  if (timeout>61) {
    state=1;
    timeout=0;
  }
}
 
// initialize the timer 2 service
void init_timer2(void) {
  TCCR2A |= (1 << WGM21) | (1 << WGM20);   
  TCCR2B |= 0x07;                         // by clk/1024
  ASSR |= (0<<AS2);                       // Use internal clock - external clock not used in Arduino
  TIMSK2 |= 0x01;                         //Timer2 Overflow Interrupt Enable
  TCNT2 = 0;
  sei();   
}

// sets up the program
void setup() {
  BTserial.begin(9600); // Bluetooth at baud 9600 for talking to the node server
  Serial.begin(4800); // Default Serial on Baud 4800 for printing out some messages in the Serial Monitor
  
  

  // bind the ledpin as output
  pinMode(ledpin, OUTPUT);

  // bind pin 2 as input
  pinMode(2,INPUT);
 
  // interrupt for reading from the bluetooth connection 
  attachInterrupt(0, cleantime, FALLING);
  init_timer2();
}

// function for controlling the led
void control(void) {
  //Serial.println("control check");
  if (BTserial.available()) {               // if data is available to read
    val = BTserial.read();                  // read it and store it in 'val'
    Serial.println(val);
  }

  if (val == '1') {                       // if '1' was received
    digitalWrite(ledpin, HIGH);           // turn ON the LED
  } else if (val == '0') { 
    digitalWrite(ledpin, LOW);            // otherwise turn it OFF
  } else if (val == 's') {                // if 's' is received display the current status of the led
    if (digitalRead(ledpin) == HIGH) {
      Serial.println('1');
    } else {
      Serial.println('0');
    } 
  }
  
  val = ' ';
    
  delay(100);                             // wait 100ms for next reading
}

// control loop for the program
void loop() {
  switch(state) {
    case 0:
      // no bt connection, do nothing
      break;
   
    case 1:
      // when there is a bt connection enter the control function
      control(); 
      break;
  }
}
 
void cleantime() {
  timeout=0;
  state=0;
}
