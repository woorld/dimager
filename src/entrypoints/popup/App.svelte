<script lang="ts">
  type TargetTabInfo = {
    tabId: number,
    url: string,
  };

  const intervalMs = 100;
  let isNoImageTabErrorVisible = $state(false);

  const onClickDownload = async () => {
    const tabs = await browser.tabs.query({
      url: 'https://cdn.discordapp.com/attachments/*' // TODO: URL共通化
    });

    if (tabs.length <= 0) {
      isNoImageTabErrorVisible = true;
      return;
    }
    isNoImageTabErrorVisible = false;

    const targetTabs: TargetTabInfo[] = [];

    for (const tab of tabs) {
      const { id, url } = tab;
      if (id == null || url == null) {
        continue;
      }

      targetTabs.push({ tabId: id, url });
    }

    downloadAndClose(targetTabs);
  };

  const downloadAndClose = (targetTabs: TargetTabInfo[]) => {
    if (targetTabs.length <= 0) {
      return;
    }

    const processEveryTab = () => {
      if (targetTabs.length <= 0) {
        clearTimeout(timerId);
        return;
      }

      const targetTab = targetTabs[0];

      browser.downloads.download({ url: targetTab.url });
      browser.tabs.remove(targetTab.tabId);

      targetTabs.shift();
      timerId = setTimeout(processEveryTab, intervalMs);
    };

    // NOTE: forで処理すると一気にダウンロードが走って怖いため、setTimeoutで処理を回す
    let timerId = setTimeout(processEveryTab, intervalMs);
  }
</script>

<main>
  <h1>dimager</h1>
  {#if isNoImageTabErrorVisible}
    <p class="red">Discordの画像タブがありません</p>
  {/if}
  <!-- TODO: ボタンの活性状態制御 -->
  <button onclick={onClickDownload}>一括DLしてタブを閉じる</button>
</main>

<style>
  .red {
    color: #ee3333;
  }
</style>
