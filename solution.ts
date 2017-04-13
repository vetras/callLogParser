
function debug(...args: any[]) {
    // enable disable debug logs
    console.log.apply(console, arguments);
}

export default class Main {

    private SEPARATOR_CALL_ENTRY: string = "\n";
    private SEPARATOR_CALL_DURATION: string = ",";
    private SEPARATOR_CALL_TIME: string = ":";
    private SEPARATOR_PHONE_DIGITS: string = "-";

    // values in seconds
    private SHORT_CALL_DURATION: number = 5 * 60;

    // cents per second
    private SHORT_CALL_PRICE: number = 3;
    // cents per minute
    private STANDARD_CALL_PRICE: number = 150;

    public solution(s: string): number {
        let callLogs = s.split(this.SEPARATOR_CALL_ENTRY);

        callLogs = this.removeFreeCalls(callLogs);

        let priceOfAllCalls = 0;
        for (let callLog of callLogs) {
            priceOfAllCalls += this.computePriceForCall(callLog);
        }

        return priceOfAllCalls;
    }

    private removeFreeCalls(callLogs: string[]): string[] {
        let totalDuration = new Map<string, number>();
        for (let callLog of callLogs) {
            let temp = callLog.split(this.SEPARATOR_CALL_DURATION);
            let callTime = temp[0];
            let phoneNbr = temp[1];

            let durationInSeconds = this.toDate(callTime).getTime() / 1000;
            this.incrementMap(totalDuration, phoneNbr, durationInSeconds);
        }

        let arr = [...totalDuration.values()];
        let max = Math.max(...arr);
        let allHighestCallDurationMap = new Map([...totalDuration].filter(([k, v]) => v === max));
        let phones = [...allHighestCallDurationMap.keys()];
        let phoneWithFreeCalls = this.computeLowerPhoneNumber(phones);

        debug("   Phone   | Total Calls Durations (s)");
        totalDuration.forEach((value, key) => {
            debug(key, value);
        });
        debug();
        debug(`highest call's duration: ${max} (s)`);
        debug(`Phones with equal highest number of call's duration (${phones.length}): `, phones);
        debug(`Phone with Free calls: ${phoneWithFreeCalls}`);
        debug();
        let res = callLogs.filter((x) => {
            let temp = x.split(this.SEPARATOR_CALL_DURATION);
            let phoneNbr = temp[1];
            debug(`call log entry: ${x} | ${phoneNbr} !== ${phoneWithFreeCalls} :: ${(phoneNbr !== phoneWithFreeCalls ? "paid" : "FREE")}`);
            return phoneNbr !== phoneWithFreeCalls;
        });
        debug();

        return res;
    }

    private incrementMap(map: Map<string, number>, key: string, value: number) {
        if (map.has(key)) {
            let newValue = map.get(key) + value;
            map.set(key, newValue);
        } else {
            map.set(key, value);
        }
    }

    private computeLowerPhoneNumber(phones: string[]): string {
        if (phones.length === 1) {
            return phones[0];
        }

        // TODO not "tested" because no input has more than one number with highest call's duration

        let onlyDigits = phones.map((phone, _, __) => {
            // replace all is split join
            return parseInt(phone.split(this.SEPARATOR_PHONE_DIGITS).join(""));
        });

        let min = Math.min(...onlyDigits);
        let backToStr = "" + min;
        backToStr = backToStr.slice(0, 6) + this.SEPARATOR_PHONE_DIGITS + backToStr.slice(6);
        backToStr = backToStr.slice(0, 3) + this.SEPARATOR_PHONE_DIGITS + backToStr.slice(3);
        return backToStr;
    }

    private computePriceForCall(log: string): number {
        let price = 0;

        let callTime = log.split(this.SEPARATOR_CALL_DURATION)[0];
        let dateTime = this.toDate(callTime);
        let seconds = dateTime.getTime() / 1000;

        if (this.isShortCall(seconds)) {
            price = seconds * this.SHORT_CALL_PRICE;
        } else {
            price = dateTime.getMinutes() * this.STANDARD_CALL_PRICE;
            if (dateTime.getSeconds() > 0) {
                price += this.STANDARD_CALL_PRICE;
            }
        }

        return price;
    }

    private isShortCall(seconds: number): Boolean {
        return seconds < this.SHORT_CALL_DURATION;
    }

    private toDate(callTime: string): Date {
        // Nice try -- does not parse so easily 
        // let time = Date.parse(callTime);
        // let time = Date.parse(callTime);
        let times = callTime.split(this.SEPARATOR_CALL_TIME);
        let hh = parseInt(times[0]);
        let mm = parseInt(times[1]);
        let ss = parseInt(times[2]);

        let time = new Date();
        time.setHours(hh);
        time.setMinutes(mm);
        time.setSeconds(ss);

        // debug(`time = '${time.toTimeString()}'`);
        // debug(`callTime = '${callTime}'`);
        // debug(`'${hh}'`);
        // debug(`'${mm}'`);
        // debug(`'${ss}'`);

        return time;
    }
}

