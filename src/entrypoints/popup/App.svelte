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
      const { id, url } = tab;
      if (id == null || url == null) {
        continue;
      }

      await browser.downloads.download({ url });
      closeTabIds.push(id);
    }

    browser.tabs.remove(closeTabIds);
  };
</script>

<main>
  <button onclick={downloadImage} >一括DLしてタブを閉じる</button>
</main>
