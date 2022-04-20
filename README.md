# 📖 Bible Tools

### 1. 🔦 Bible Passage Lookup 

#### 1.1 Passage search
Default:
```bash
bible [options] [passage...]
```
Example:
```bash
bible Matthew 4:4
# =>
#   [4] But he answered, “It is written,
#
#   “‘Man shall not live by bread alone,
#        but by every word that comes from the mouth of God.’”
```

#### 1.1.1 Passage search to clipboard

```bash
bible -c [passage...]
```
```bash
bible --copy [passage...]
```

#### 1.2 Passage search REPL

This command opens a REPL environemt and logs each passage to the console.

```bash
bible
```

Example:
```
bible
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
bible -c
```
```bash
bible --copy
```

#### 1.3 Set Translation

```bash
bible -t <translation>
```

Example: 
```ini
bible -t NASB gen 1:1
# => The Creation
#
# [1] In the beginning God created the heavens and the earth.
# Genesis 1:1 (New American Standard Bible)
```