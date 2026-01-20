<script lang="ts">
  import { discordImageUrl, processIntervalMs } from '@/constants';

  type TargetTabInfo = {
    tabId: number,
    url: string,
  };

  let isNoImageTabErrorVisible = $state(false);
  let isButtonEnabled = $state(true);

  const onClickDownload = async () => {
    isButtonEnabled = false;

    const tabs = await browser.tabs.query({ url: discordImageUrl });

    if (tabs.length <= 0) {
      isNoImageTabErrorVisible = true;
      isButtonEnabled = true;
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
      isButtonEnabled = true;
      return;
    }

    const processEveryTab = () => {
      if (targetTabs.length <= 0) {
        clearTimeout(timerId);
        isButtonEnabled = true;
        return;
      }

      const targetTab = targetTabs[0];

      browser.downloads.download({ url: targetTab.url });
      browser.tabs.remove(targetTab.tabId);

      targetTabs.shift();
      timerId = setTimeout(processEveryTab, processIntervalMs);
    };

    // NOTE: forで処理すると一気にダウンロードが走って怖いため、setTimeoutで処理を回す
    let timerId = setTimeout(processEveryTab, processIntervalMs);
  }
</script>

<main>
  <h1>dimager</h1>
  {#if isNoImageTabErrorVisible}
    <p class="red">Discordの画像タブがありません</p>
  {/if}
  <button disabled={!isButtonEnabled} onclick={onClickDownload}>一括DLしてタブを閉じる</button>
</main>

<style>
  .red {
    color: #ee3333;
  }
</style>
