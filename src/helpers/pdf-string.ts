export const pdfString = (
    transaction_table_header: Array<string>,
    transaction_table_body: Array<Record<string, string | number>>,
    account_table_header: Array<string>,
    account_table_body: Array<Record<string, string | number>>,
    enterprise_data: Record<string, string | number>,
    user_details: Record<string, string>,
    summary_by_months_table_header?: Array<string>,
    summary_by_months_table_body?: Array<Record<string, string | number>>,
    income_streams?: Record<string, string | number>
) => {

    const t_table_head = transaction_table_header.map((entry) => (
        `<th>${entry}</th>`
    ))

    const t_table_body = transaction_table_body.map((entry) => {
        const td = Object.values(entry).map((ele) => `<td>${ele}</td>`)
        return `<tr>${td}</tr>`
    })

    const a_table_head = account_table_header.map((entry) => (
        `<th>${entry}</th>`
    ))

    const a_table_body = account_table_body.map((entry) => {
        const td = Object.values(entry).map((ele) => `<td>${ele}</td>`)
        return `<tr>${td}</tr>`
    })


    const s_table_head = summary_by_months_table_header.map((entry) => (
        `<th>${entry}</th>`
    ))

    const s_table_body = summary_by_months_table_body.map((entry) => {
        const td = Object.values(entry).map((ele) => `<td>${ele}</td>`)
        return `<tr>${td}</tr>`
    })

    const u_data_keys = Object.keys(user_details);

    let u_data = "";
    u_data_keys.map((entry) => u_data = u_data.concat(`<p style="text-transform: capitalize;"><strong>${entry.split('_').join(' ')}: </strong> ${user_details[entry]}</p>`))


    const i_data_keys = Object.keys(income_streams  ?? {});

    let i_data = "";
    i_data_keys.map((entry) => i_data = i_data.concat(`<p style="text-transform: capitalize;"><strong>${entry.split('_').join(' ')}: </strong> ${income_streams[entry]}</p>`))


    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BankPassport Report</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
    
            .container {
                width: 80%;
                margin: auto;
                padding: 20px;
            }
    
            .header {
                text-align: left;
                padding: 10px 0;
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: flex-start;
            }
    
            .header h4 {
                font-size: 16px;
                line-height: 0px;
                text-align: left;
            }
    
            .header p {
                margin: 0;
                color: rgba(0, 0, 0, 0.7);
            }
    
            .logo {
                text-align: right;
                font-size: 34px;
                color: #009e60;
                font-weight: bold;
            }
    
            .section {
                margin: 20px 0;
            }
    
            .section h2 {
                border-bottom: 1px solid #ccc;
                padding-bottom: 10px;
                font-size: 20px;
                margin-top: 60px;
            }
    
            .content p {
                margin: 8px 0;
            }
    
            .risk-check {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                margin-bottom: 20px;
                gap: 70px;
            }
    
            .risk-check .box .box-1 {
                border: 1px solid #ccc;
                padding: 10px 18px;
                text-align: center;
                border-radius: 10px;
                font-size: 9px;
            }
    
            .risk-check .box {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }
    
            .checkmark {
                width: 35px;
                height: 35px;
                border-radius: 30px;
                background-color: green;
                display: flex;
                justify-content: center;
                align-items: center;
            }
    
            .xmark {
                display: inline-block;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: red;
            }
    
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
    
            table,
            th,
            td {
                border: 1px solid #ddd;
            }
    
            .risk-check 
            table,
            th,
            td {
                border: none !important;
            }
    
            th,
            td {
                padding: 10px;
                text-align: center;
            }
    
            th {
                background-color: #f9f9f9;
                font-weight: bold;
            }
    
            .green-text {
                color: green;
                font-weight: bold;
            }
    
            .red-text {
                color: red;
                font-weight: bold;
            }
    
            .footer {
                text-align: left;
                font-size: 12px;
                color: #777;
            }
    
            .box {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 10px;
            }
    
            .high {
                display: flex;
                border-radius: 10px;
                height: 15px;
                padding: 3px;
                font-size: 12px;
                justify-content: center;
                align-items: center;
                background-color: #fbacb4;
            }
    
            .money {
                display: flex;
                border-radius: 10px;
                width: 60px;
                height: 15px;
                padding: 3px;
                font-size: 12px;
                justify-content: center;
                align-items: center;
                background-color: #a3ffae;
            }
    
            .months {
                display: flex;
                border-radius: 10px;
                width: 60px;
                height: 15px;
                padding: 3px;
                font-size: 12px;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.4);
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <div>
                    <h4>ForseeRisk Insights Report No. ${enterprise_data?.risk_number}</h4>
                    <h4>EnterpriseID: ${enterprise_data?.enterprise_id} (${enterprise_data?.enterprise_name})</h4>
                    <p>Period covered: 01 Jan 2024 - 01 July 2024</p>
                    <p>Months covered: 6 Months</p>
                    <p>Currency: ${enterprise_data?.currency}</p>
                    <p>Date created: ${new Date().toDateString()}</p>
                    <p>Report version ${enterprise_data?.report_version}</p>
                </div>
                <div class="logo">Bank<span style="color: rgba(0, 0, 0, 0.5);">Passport</span></div>
            </div>
    
            <div class="section">
                <h2>Account Information</h2>
                <div class="content">
                  ${u_data}
                </div>
            </div>

            ${i_data && `
            <div class="section">
                <h2>Income streams</h2>
                <div class="content">
                ${i_data}
                </div>
            </div>`
            }
    
            <div class="section">
                <h2>Tuition payment risk check</h2>
                <div class="risk-check">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div>
                                        <div class="box">
                                            <div class="box-1">
                                                Living expenses check
                                            </div>
                                            <svg fill="#076e13" width="24px" height="24px" viewBox="0 0 56 56"
                                                xmlns="http://www.w3.org/2000/svg" stroke="#076e13">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                    stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 24.7655 40.0234 C 23.9687 40.0234 23.3593 39.6719 22.6796 38.8750 L 15.9296 30.5312 C 15.5780 30.0859 15.3671 29.5234 15.3671 29.0078 C 15.3671 27.9063 16.2343 27.0625 17.2655 27.0625 C 17.9452 27.0625 18.5077 27.3203 19.0702 28.0469 L 24.6718 35.2890 L 35.5702 17.8281 C 36.0155 17.1016 36.6249 16.75 37.2343 16.75 C 38.2655 16.75 39.2733 17.4297 39.2733 18.5547 C 39.2733 19.0703 38.9687 19.6328 38.6640 20.1016 L 26.7577 38.8750 C 26.2421 39.6484 25.5858 40.0234 24.7655 40.0234 Z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
    
                                        <div class="box">
                                            <div class="box-1">
                                                Next month balance forecast
                                            </div>
                                            <svg fill="#076e13" width="24px" height="24px" viewBox="0 0 56 56"
                                                xmlns="http://www.w3.org/2000/svg" stroke="#076e13">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                    stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 24.7655 40.0234 C 23.9687 40.0234 23.3593 39.6719 22.6796 38.8750 L 15.9296 30.5312 C 15.5780 30.0859 15.3671 29.5234 15.3671 29.0078 C 15.3671 27.9063 16.2343 27.0625 17.2655 27.0625 C 17.9452 27.0625 18.5077 27.3203 19.0702 28.0469 L 24.6718 35.2890 L 35.5702 17.8281 C 36.0155 17.1016 36.6249 16.75 37.2343 16.75 C 38.2655 16.75 39.2733 17.4297 39.2733 18.5547 C 39.2733 19.0703 38.9687 19.6328 38.6640 20.1016 L 26.7577 38.8750 C 26.2421 39.6484 25.5858 40.0234 24.7655 40.0234 Z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                        <div class="box">
                                            <div class="box-1">
                                                Extra Savings
                                            </div>
                                            <svg fill="#076e13" width="24px" height="24px" viewBox="0 0 56 56"
                                                xmlns="http://www.w3.org/2000/svg" stroke="#076e13">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                    stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 24.7655 40.0234 C 23.9687 40.0234 23.3593 39.6719 22.6796 38.8750 L 15.9296 30.5312 C 15.5780 30.0859 15.3671 29.5234 15.3671 29.0078 C 15.3671 27.9063 16.2343 27.0625 17.2655 27.0625 C 17.9452 27.0625 18.5077 27.3203 19.0702 28.0469 L 24.6718 35.2890 L 35.5702 17.8281 C 36.0155 17.1016 36.6249 16.75 37.2343 16.75 C 38.2655 16.75 39.2733 17.4297 39.2733 18.5547 C 39.2733 19.0703 38.9687 19.6328 38.6640 20.1016 L 26.7577 38.8750 C 26.2421 39.6484 25.5858 40.0234 24.7655 40.0234 Z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </div>
                                        <div class="box" style="align-items: flex-start;">
                                            <div>
                                                <div class="box-1">
                                                    Exchange Rate Volatility
                                                </div>
                                                <p style="font-size: 9px;">Switch: 6month I 30davs I 60day forecast</p>
                                            </div>
                                            <div>
                                                <div class="high" style="width: 50px; height:20px;">
                                                    <p style="font-size: 9px;">HIGH-33%</p>
                                                    <svg fill="#d00101" width="24px" height="24px" viewBox="0 0 32 32"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                                            stroke-linejoin="round"></g>
                                                        <g id="SVGRepo_iconCarrier">
                                                            <path d="M24 11.305l-7.997 11.39L8 11.305z"></path>
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div class="box">
                                            <div>
                                                <div class="box-1">
                                                    Next month balance forecast
                                                </div>
                                            </div>
                                            <div style="height: 20px;">
                                                <div class="money" style="width: 50px; height:20px;">
                                                    <p style="font-size: 11px;">$400</p>
    
                                                </div>
                                                <p style="font-size: 8px; margin-top: 0px;">Current day exchange rate</p>
                                            </div>
                                        </div>
    
                                        <div class="box">
                                            <div>
                                                <div class="box-1">
                                                    Next month balance forecast
                                                </div>
                                            </div>
                                            <div style="height: 20px;">
                                                <div class="high" style="width: 50px; height:20px;">
                                                    <p style="font-size: 11px;">$67.87</p>
                                                </div>
                                                <p style="font-size: 8px; margin-top: 0px;">Forecasted exchange rate
                                                    volatility</p>
                                            </div>
                                        </div>
                                        <div class="box">
                                            <div>
                                                <div class="box-1">
                                                    Requested payment plan
                                                </div>
                                            </div>
                                            <div style="height: 20px;">
                                                <div class="months" style="width: 50px; height:20px;">
                                                    <p style="font-size: 7px;">6 months</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="box">
                                            <div>
                                                <div class="box-1">
                                                    Overall risk of default
                                                </div>
                                            </div>
                                            <div style="height: 20px;">
                                                <div class="high">
                                                    <p style="font-size: 8px;">HIGH</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
    
            ${s_table_head && `<div class="section" style="margin-top: 1400px; padding-top: 70px">
            <h2>Balance overview</h2>
            <p>Focus period covered: 01 Jan 2024 - 01 July 2024</p>
            <p>Exchange rate: Prevailing daily exchange rate during the period</p>

            <table>
                <thead>
                    <tr>
                        ${s_table_head}
                    </tr>
                </thead>
                <tbody>
                    ${s_table_body}
                </tbody>
            </table>
        </div>`}
           
            ${a_table_body.length &&
        `
            <div class="section">
                <h2>Account history</h2>
                <p>Focus period covered: 01 Jan 2024 - 01 July 2024</p>
                <p>Exchange rate: Prevailing daily exchange rate during the period</p>
                <table>
                <thead><tr>${a_table_head}</tr></thead>
                <tbody>${a_table_body}</tbody>
            </table>
            </div>`
        }
            
        ${t_table_body.length && `<div class="section">
        <h2>Transaction history</h2>
        <p>Exchange rate: Prevailing daily exchange rate during the period</p>

        <table>
            <thead><tr>${t_table_head}</tr></thead>
            <tbody>${t_table_body}</tbody>
        </table>
    </div>`}
        

<div class="footer" >
    <p>BankPassport uses MonoAPI to link customer financial data in Nigeria.Mono is a registered OpenBanking
                    provider with registration no 12345. BankPassport is a registered...</p>
   `
}