#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

const byte ROWS = 4;  // four rows
const byte COLS = 4;  // four columns

// Map the buttons to an array for the Keymap instance
char hexaKeys[ROWS][COLS] = {
  { '1', '2', '3', '+' },
  { '4', '5', '6', '-' },
  { '7', '8', '9', '*' },
  { 'a', '0', '=', '/' }
};

char hexaKeys2[ROWS][COLS] = {
  { 'i', 'o', 'd', 'f' },
  { 'x', 'x', 'x', 'x' },
  { 'x', 'x', 'x', 'x' },
  { 'x', 'x', 'x', 'x' }
};

byte colPins[ROWS] = { 5, 4, 3, 2 };  // Pins used for the rows of the keypad
byte rowPins[COLS] = { 9, 8, 7, 6 };  // Pins used for the columns of the keypad

byte colPins2[ROWS] = { 28, 26, 24, 22 };  // Pins used for the rows of the keypad
byte rowPins2[COLS] = { 36, 34, 32, 30 };  // Pins used for the columns of the keypad

// Initialise the Keypad
Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);
Keypad customKeypad2 = Keypad(makeKeymap(hexaKeys2), rowPins2, colPins2, ROWS, COLS);

char arr[1000];

void (*resetFunc)(void) = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  lcd.init();       // initialize the lcd
  lcd.backlight();  // Turn on the LCD screen backlight
}

void error() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Math Error");
}

void cusid(){
  while(true){
    char df = customKeypad.getKey();
    if (df) {
      Serial.println(df);
      break;
    }
  }
}


void cashin() {
  while (true) {
  char df = customKeypad2.getKey();
    if (df) {
      Serial.println(df);
      // if (df == 'd') {
      //   // Serial.println("Cash In with due");
      // } else if (df == 'f') {
      //   // Serial.println("Cash In with fully paid");
      // }
      // Serial.println("Enter Customer Id");
      // char d = customKeypad.getKey();
      // Serial.println(d);
      cusid();
      break;
    }
  }
}




void cashout() {
  while (true) {
    char df = customKeypad2.getKey();
    if (df) {
      Serial.println(df);
      // if (df == 'd') {
      //   // Serial.println("Cash Out with due");
      // } else if (df == 'f') {
      //   // Serial.println("Cash Out with fully paid");
      // }
      cusid();
      break;
    }
  }
}

float fun(int cid) {
  float temp1 = 0, temp2 = 0;
  char last = '!';

  int ind = 0;
  while (arr[ind] >= 48 && arr[ind] <= 57) {
    temp1 = temp1 * 10 + arr[ind] - '0';
    // Serial.println(temp1);
    ind++;
  }
  last = arr[ind];

  for (int i = ind + 1; i < cid; i++) {
    if (arr[i] < 48 || arr[i] > 57) {
      if (last == '+') {
        temp1 += temp2;
        temp2 = 0;
      } else if (last == '-') {
        temp1 -= temp2;
        temp2 = 0;
      } else if (last == '*') {
        temp1 *= temp2;
        temp2 = 0;
      } else if (last == '/') {
        if (temp2 == 0) {
          error();
          break;
        }
        temp1 /= temp2;
        temp2 = 0;
      }
      last = arr[i];
    } else {
      temp2 = (temp2 * 10) + (arr[i] - '0');
      // Serial.println(temp2);
    }
  }

  if (last == '+') {
    temp1 += temp2;
  } else if (last == '-') {
    temp1 -= temp2;
  } else if (last == '*') {
    temp1 *= temp2;
  } else if (last == '/') {
    if (temp2 == 0) {
      error();
      return -1e9;
    } else {
      temp1 /= temp2;
    }
  }

  return temp1;
}

void aftercal(float ans) {
  while (true) {
    char cash = customKeypad2.getKey();
    if (cash) {
      Serial.println(cash);
      if (cash == 'i') {
        // Serial.println("Cashin called");
        cashin();
      } else if (cash == 'o') {
        // Serial.println("Cashout called");
        cashout();
      }
      break;
    }
  }
}


void loop() {
  // put your main code here, to run repeatedly:
  // char button = customKeypad.getKey();
  lcd.setCursor(0, 0);
  int cid = 0;
  while (true) {
    char button = customKeypad.getKey();
    if (button) {
      Serial.print(button);
      if (button == 'a') {
        resetFunc();
      }
      if (button == '=') {
        float ans = fun(cid);
        Serial.println(ans);
        lcd.setCursor(0, 1);
        lcd.print(ans);
        // Serial.println("Cal performed");
        // Serial.println("aftercal() called");
        aftercal(ans);
        // Serial.println("aftercal() stopped");
        // button = customKeypad.getKey();
        // char button2 = customKeypad2.getKey();
        // if (button2) {
        //   if (button2 == 'a') {
        //     resetFunc();
        //   } else if (button2 == 'i') {
        //     cashin();
        //   } else if (button2 == 'o') {
        //     cashout();
        //   }
        // }
        break;
      }
      if ((button < 48 || button > 57) && (arr[cid - 1] < 48 || arr[cid - 1] > 57)) {
        // cid--;
        arr[cid - 1] = button;
      } else {
        arr[cid++] = button;
      }
      if (cid >= 16) {
        for (int i = cid - 16; i < cid; i++) {
          lcd.print(arr[i]);
        }
      } else {
        for (int i = 0; i < cid; i++) {
          lcd.print(arr[i]);
        }
      }
      lcd.setCursor(0, 0);
    }
  }




  // lcd.setCursor(0, 0);
  // if (button) {
  //   Serial.println(button);
  //   lcd.print(button);
  //   // delay(3000);
  // }
  // if (button2) {
  //   Serial.println(button2);
  //   lcd.print(button2);
  //   // delay(3000);
  // }
}
