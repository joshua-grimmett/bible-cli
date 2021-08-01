# 📖 Bible Tools — ESV

### 1. 🔦 Bible Passage Lookup 

#### 1.0 Requirements

You must have an API key set in your environment variables.

```bash
ESV_API_KEY = # API KEY HERE
```

#### 1.1 Passage search
Default:
```bash
esv [passage...]
```
Example:
```bash
esv Matthew 4:4
# =>
#   [4] But he answered, “It is written,
#
#   “‘Man shall not live by bread alone,
#        but by every word that comes from the mouth of God.’”
```

#### 1.1.1 Passage search to clipboard

```bash
esv -c [passage...]
```
```bash
esv --copy [passage...]
```

#### 1.2 Passage search REPL

This command opens a REPL environemt and logs each passage to the console.

```bash
esv
```

Example:
```bash
esv
> Matthew 4:4
  [4] But he answered, “It is written,

    “‘Man shall not live by bread alone,
        but by every word that comes from the mouth of God.’”
    

> col 3:2
  [2] Set your minds on things that are above, not on things that are on earth.
```

#### 1.2.1 Passage search REPL to clipboard

This command opens a REPL environment and copies each passage to the clipboard.

```bash
esv -c
```
```bash
esv --copy
```