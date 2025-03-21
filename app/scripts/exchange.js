export async function krw_usd() {
    try {
        const response = await fetch('https://api.frankfurter.app/latest?amount=1&from=KRW&to=USD');
        const data = await response.json();
        if (data && data.rates && data.rates.USD) {
            return data.rates.USD;
        } else {
            console.error('krw_usd() error: 환율 정보를 찾을 수 없습니다.');
            return null;
        }
    } catch (error) {
        console.error('krw_usd() catch error: ', error);
        return null;
    }
}