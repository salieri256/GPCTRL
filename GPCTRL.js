class GPCTRL {
    constructor(connectedId = 0, btnIndex = {}, axesIndex = {}) {
        this.connectedId = connectedId;// コントローラの接続番号

        this.btnIndex = {
            A: 1,
            B: 0,
            X: 3,
            Y: 2,
            L: 4,
            R: 5,
            ZL: 6,
            ZR: 7,
            MINUS: 8,
            PLUS: 9,
            LSTICK: 10,
            RSTICK: 11,
            UP: 12,
            DOWN: 13,
            LEFT: 14,
            RIGHT: 15,
            HOME: 16,
            CAPTURE: 17
        }

        this.axesIndex = {
            LHAxis: 0,// 左水平
            LVAxis: 1,// 左垂直
            RHAxis: 2,// 右水平
            RVAxis: 3// 右垂直
        }

        // 引数によるインデックスの設定
        for(const key in this.btnIndex) {
            const index = btnIndex[key];
            if(index === undefined) continue;

            this.btnIndex[key] = index;
        }

        for(const key in this.axesIndex) {
            const index = axesIndex[key];
            if(index === undefined) continue;

            this.axesIndex[key] = index;
        }

        this.btnStatus = {
            A: {isPressed: false, isHeld: false},
            B: {isPressed: false, isHeld: false},
            X: {isPressed: false, isHeld: false},
            Y: {isPressed: false, isHeld: false},
            L: {isPressed: false, isHeld: false},
            R: {isPressed: false, isHeld: false},
            ZL: {isPressed: false, isHeld: false},
            ZR: {isPressed: false, isHeld: false},
            MINUS: {isPressed: false, isHeld: false},
            PLUS: {isPressed: false, isHeld: false},
            LSTICK: {isPressed: false, isHeld: false},
            RSTICK: {isPressed: false, isHeld: false},
            UP: {isPressed: false, isHeld: false},
            DOWN: {isPressed: false, isHeld: false},
            LEFT: {isPressed: false, isHeld: false},
            RIGHT: {isPressed: false, isHeld: false},
            HOME: {isPressed: false, isHeld: false},
            CAPTURE: {isPressed: false, isHeld: false}
        }

        this.axesStatus = {
            LVAxis: 0.0,
            LHAxis: 0.0,
            RVAxis: 0.0,
            RHAxis: 0.0
        }
    }

    // 状態を更新する
    update() {
        const gpList = navigator.getGamepads();
        const usedGP = gpList[this.connectedId];
        if(usedGP === null) return;
        
        const axes = usedGP.axes;
        const buttons = usedGP.buttons;

        // ボタンの状態を更新
        for(const key in this.btnStatus) {
            const isPressed = buttons[this.btnIndex[key]].pressed;// ボタンの押下の状態を取得

            if (isPressed && !this.btnStatus[key].isHeld) {// ボタンが押された かつ それまでボタンが押されていなければ
                this.btnStatus[key].isPressed = true;
            } else {
                this.btnStatus[key].isPressed = false;
            }
            this.btnStatus[key].isHeld = isPressed;
        }

        // スティックの状態を更新
        for(const key in this.axesStatus) {
            const num = axes[this.axesIndex[key]];// スティックの傾き具合を取得
            this.axesStatus[key] = num;
        }
    }

    // 振動させる
    pulse(power, ms) {
        const gpList = navigator.getGamepads();
        const usedGP = gpList[this.connectedId];
        if(usedGP === null) return;

        usedGP.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,// 何ms後に振動させるか
            duration: ms,// 何ms振動させるか
            //weakMagnitude: 0.1,// 振動の浅さ?
            strongMagnitude: power,//振動の強さ 
        });
    }

    // ボタンの状態を返す
    getBtnStatus() {
        return this.btnStatus;
    }

    // スティックの状態を返す
    getAxesStatus() {
        return this.axesStatus;
    }
}

//const gpctrl = new GPCTRL(0);

//export {gpctrl};

// <参考>
// Gamepad Tester
// https://gamepad-tester.com/