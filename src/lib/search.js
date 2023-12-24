import { getUserData } from "./userData";

const paymentCards = () => {
    const cards = [];
    const safes = getUserData().safes;
    for (const safe of safes) {
      if (safe.key) {
        // key!= null => confirmed, better have a class
        for (const item of safe.rawItems) {
          if (item.version === 5 && item.cleartext[0] === "card") {
            cards.push({
              safe: safe.name,
              title: item.cleartext[1],
              card: item.cleartext,
            });
          }
        }
      }
    }
    return { id: "payment", found: cards };
  };


  function hostInItem(hostname, item) {
    const urls = item.cleartext[3].split("\x01");

    for(let url of urls) {
      try {
        url = url.toLowerCase();
        if (url.substring(0, 4) != "http") {
          url = "https://" + url;
        }
        url = new URL(url);
        let itemHost = url.hostname.toLowerCase();
        if (itemHost.substring(0, 4) === "www.") {
          itemHost = itemHost.substring(4);
        }
        if (itemHost == hostname) {
          return true;
        }
      } catch (err) {}
    }
    return false
}



  const advise = (what) => {
    if (what.id === "payment page") {
      return paymentCards();
    }
    const safes = getUserData().safes;

    if (what.id === "advise request" || what.id === "not a payment page") {
      const u = new URL(what.url);
      let hostname = u.hostname.toLowerCase();
      if (hostname.substring(0, 4) === "www.") {
        hostname = hostname.substring(4);
      }
      const result = [];
      if (hostname) {
        for (const safe of safes) {
          if (safe.key) {
            // key!= null => confirmed, better have a class
            const items = safe.rawItems;
            for (const item of items) {
              if(hostInItem(hostname, item)) {
                result.push({
                  safe: safe.name,
                  title: item.cleartext[0],
                  username: item.cleartext[1],
                  password: item.cleartext[2],
                });
              }
            }
          }
        }
      }
      return { id: "advise", hostname, found: result };
    }
  };

  const searchFolders = (what) => {
    
    const safes = getUserData().safes;

    const result = [];
    const lcWhat = what.toLowerCase();
    for (const safe of safes) {
      if (safe.key) {
        // key!= null => confirmed, better have a class
        for (const folder of safe.rawFolders) {
          if (folder.cleartext[0].toLowerCase().indexOf(lcWhat) >= 0) {
            result.push(folder);
          }
        }
      }
    }

    result.sort((a, b) =>
      a.cleartext[0].toLowerCase().localeCompare(b.cleartext[0].toLowerCase())
    );
    return result;
  }

  const search = (what) => {

    const safes = getUserData().safes;
    const result = [];

    const lcWhat = what.toLowerCase();
    for (const safe of safes) {
      if (safe.key) {
        // key!= null => confirmed, better have a class
        for (const item of safe.rawItems) {
          let found = false;

          if (item.cleartext.length == 8) {
            // card
            if (item.cleartext[1].toLowerCase().indexOf(lcWhat) >= 0) {
              found = true;
            } else if (item.cleartext[2].toLowerCase().indexOf(lcWhat) >= 0) {
              found = true;
            }
          } else {
            if (item.cleartext[0].toLowerCase().indexOf(lcWhat) >= 0) {
              found = true;
            } else if (item.cleartext[1].toLowerCase().indexOf(lcWhat) >= 0) {
              found = true;
            } else if (item.cleartext[3].toLowerCase().indexOf(lcWhat) >= 0) {
              found = true;
            } else if (item.cleartext[4].toLowerCase().indexOf(lcWhat) >= 0) {
              found = true;
            }
          }
          if (found) {
            result.push(item);
          }
        }
      }
    }

    result.sort((a, b) =>
      a.cleartext[0].toLowerCase().localeCompare(b.cleartext[0].toLowerCase())
    );

    return result;
  }    


  export {
    advise,
    search,
    searchFolders
  };
