import './Privacy.css'

export default function Privacy() {
  return (
    <div className="privacy">
      <div className="container">
        <div className="privacy-header">
          <h1>隱私條款</h1>
          <p>最後更新日期：{new Date().getFullYear()}年</p>
        </div>
        <div className="privacy-content">
          <section>
            <h2>服務說明</h2>
            <p>本網站完全免費，無須登入或註冊即可使用所有功能。</p>
          </section>

          <section>
            <h2>資料收集政策</h2>
            <p>我們不會收集您的個人資料，也不會販售任何資料給第三方。本網站不會追蹤您的瀏覽行為或儲存任何個人識別資訊。</p>
          </section>

          <section>
            <h2>聯絡訊息處理</h2>
            <p>當您透過聯絡表單提交訊息時：</p>
            <ul>
              <li>您的訊息僅會傳送到網站後台管理系統</li>
              <li>訊息僅用於回覆您的詢問</li>
              <li>回覆完成後，所有相關訊息會立即刪除</li>
              <li>我們不會將您的聯絡資訊用於其他目的</li>
            </ul>
          </section>

          <section>
            <h2>資料安全</h2>
            <p>我們重視您的隱私，所有聯絡訊息均儲存在本地系統中，不會上傳至任何外部伺服器或雲端服務。</p>
          </section>

          <section>
            <h2>聯絡我們</h2>
            <p>如果您對本隱私條款有任何疑問，請透過聯絡表單與我們聯繫。</p>
          </section>
        </div>
      </div>
    </div>
  )
}

