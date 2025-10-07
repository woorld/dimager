<script lang="ts">
  const downloadImage = async () => {
    const tabs = await browser.tabs.query({
      url: 'https://cdn.discordapp.com/attachments/*' // TODO: URL共通化
    });

    if (tabs.length <= 0) {
      return;
    }

    const closeTabIds: number[] = [];

    for (const tab of tabs) {
      // TODO: まともな例外処理
      await browser.downloads.download({ url: tab.url || '', saveAs: true }); // TODO: saveAsで保存先を指定
      closeTabIds.push(tab.id || 0);
    }

    browser.tabs.remove(closeTabIds);
  };
</script>

<main>
  <button onclick={downloadImage} >一括DLしてタブを閉じる</button>
</main>
