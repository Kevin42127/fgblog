import './Terms.css'

export default function Terms() {
  return (
    <div className="terms">
      <div className="container">
        <div className="terms-header">
          <h1>服務條款</h1>
          <p>最後更新日期：{new Date().getFullYear()}年</p>
        </div>
        <div className="terms-content">
          <section>
            <h2>接受條款</h2>
            <p>使用本網站即表示您同意遵守並受本服務條款的約束。如果您不同意這些條款，請勿使用本服務。</p>
          </section>

          <section>
            <h2>服務說明</h2>
            <p>本網站提供以下服務：</p>
            <ul>
              <li>文章瀏覽和閱讀</li>
              <li>聯絡表單提交</li>
              <li>其他相關服務</li>
            </ul>
          </section>

          <section>
            <h2>訪客功能</h2>
            <p>各位訪客可使用以下功能：</p>
            <ul>
              <li>查看文章內容</li>
              <li>瀏覽隱私條款</li>
              <li>瀏覽服務條款</li>
            </ul>
            <p>訪客無需登入或註冊即可使用上述功能。</p>
          </section>

          <section>
            <h2>開發者登入</h2>
            <p>開發者登入功能僅限授權的開發者使用。未經授權的訪客不得嘗試登入或存取後台管理系統。</p>
          </section>

          <section>
            <h2>使用者責任</h2>
            <p>使用本服務時，您同意：</p>
            <ul>
              <li>提供準確、真實的資訊</li>
              <li>不得使用本服務進行任何非法活動</li>
              <li>不得干擾或破壞本網站的正常運作</li>
              <li>尊重他人的權利和隱私</li>
            </ul>
          </section>

          <section>
            <h2>智慧財產權</h2>
            <p>本網站的所有內容，包括但不限於文字、圖片、標誌、設計等，均受智慧財產權法保護。未經授權，不得複製、轉載或使用。</p>
          </section>

          <section>
            <h2>免責聲明</h2>
            <p>本網站提供的資訊僅供參考。我們不對以下事項承擔責任：</p>
            <ul>
              <li>資訊的準確性、完整性或時效性</li>
              <li>因使用或無法使用本服務而造成的任何損失</li>
              <li>第三方網站連結的內容</li>
            </ul>
          </section>

          <section>
            <h2>服務變更</h2>
            <p>我們保留隨時修改、暫停或終止本服務的權利，無需事先通知。我們不對任何服務變更承擔責任。</p>
          </section>

          <section>
            <h2>條款修改</h2>
            <p>我們保留隨時修改本服務條款的權利。修改後的條款將在本頁面公布。繼續使用本服務即表示您接受修改後的條款。</p>
          </section>

          <section>
            <h2>聯絡我們</h2>
            <p>如果您對本服務條款有任何疑問，請透過聯絡表單與我們聯繫。</p>
          </section>
        </div>
      </div>
    </div>
  )
}

