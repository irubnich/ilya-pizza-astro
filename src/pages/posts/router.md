---
title: Building a DIY Router in 2019
publishDate: 2019-11-10
layout: ../../layouts/PostLayout.astro
setup: |
    import { Code } from 'astro/components'
---

# The Itch
As a tech nerd, I get bored easily - I switch between iOS and Android at least once a year (thank you, T-Mobile Jump), I switch between Windows and Mac at least twice a year (Hackintosh), and sometimes I even try out Linux as a daily driver to see if someone's finally made HiDPi monitors easier to use (so far, no).

But recently I've had an itch that I haven't had in a while - an itch to mess with hardware. I found myself resentfully looking at my Verizon Quantum Gateway that I pay $10/month to rent. It's honestly not a bad router, but the itch isn't rational.

I wanted to replace it, but I didn't want to just use my old ASUS RT-AC66U. I also didn't want to shell out up to $500 on a top-end WiFi 6 router that looks like a sci-fi [spaceship](https://www.amazon.com/NETGEAR-Nighthawk-8-Stream-AX6000-Router/dp/B01MQDZXA4/ref=sr_1_3?keywords=wifi+6+router&qid=1560717774&s=electronics&sr=1-3) or an [angry spider](https://www.amazon.com/ASUS-GT-AX11000-Tri-Band-Aiprotection-Compatible/dp/B07MRD1LDZ/ref=sr_1_4?keywords=wifi+6+router&qid=1560717870&s=electronics&sr=1-4) that might invert its antennae and scurry away.

So I had an arguably irrational thought - what would it take to build a router myself? All I'd really need is a dumb board with 2 ethernet ports, a switch, and a WiFi access point.

# (Arguably Not Enough) Research
I started looking around the internet for signs that I'm not totally out of my mind and stumbled upon this [wonderful blog post](https://blog.tjll.net/building-my-perfect-router/) by Tyler Langlois. Turns out, the "dumb board" I had been looking for was the [ESPRESSObin](https://espressobin.net/), a Marvell ARM board with 3 gigabit ethernet ports that's purpose-built for networking.

I also found [this post](https://arstechnica.com/gadgets/2016/01/numbers-dont-lie-its-time-to-build-your-own-router/) by Jim Salter of Ars Technica that proved out the economics of building a router vs. buying one - turns out it's cheaper and just as performant as any high-end router you could pick off the shelf. With this in mind, I felt good about scratching this particular itch.

# Sidebar - What is a Router?
What most people call a "router" is really a combination of 3 devices - a gateway, a switch, and an access point. Typically these devices are separate in a larger network (such as a corporate network), but for a home network, it's common to see one device take on all three roles. So, this is what your black-or-blue box with the antennas really is.

A **gateway** is a device that sits between your ISP and your home network and allows all the devices on your home network to connect to the internet. In most cases, your ISP only assigns you 1 IP address. But according to the TCP/IP protocol that makes the internet work, every device needs a unique IP address. So how do your phone and laptop both access the internet with only 1 IP?

A gateway uses something called Network Address Translation (NAT) to solve this by creating a local network with its own IP address space (typically in the range of 192.168.1.2 - 192.168.1.254). So while your ISP-assigned IP is something like 108.110.50.153, the gateway isolates this from your devices and instead assigns them something like 192.168.1.150. Now that all your devices have a unique IP, they can access the internet!

![gateway diagram](https://images.squarespace-cdn.com/content/v1/61bcac49354605783a93d507/b5aa8c65-4b11-42f5-a0ad-d91d117b105d/Untitled.png)

A **switch** is a device that routes network traffic between devices. Switches are great because they work transparently - you can plug as many devices into a switch as it allows, and network traffic will flow between those devices.

For this setup, we will plug the internet-connected ESPRESSObin into the switch. Because the switch knows **how to route traffic between all devices plugged into it, it will allow any other devices plugged into the switch to access the internet via the ESPRESSObin.

Finally, an **access point** (AP) is a device that uses your wired network to create a wireless (WiFi) network. You can plug an AP into anything that has access to the internet (like our switch!) and it will create a WiFi network for all your wireless devices.

I guess my [A+ certification](https://certification.comptia.org/certifications/a) class from high school was useful after all!

# Requirements
My requirements for a DIY router were fairly simple - I wanted something that was easy to set up, low-maintenance, highly customizable, and performant.

To meet the "easy to set up" and "low-maintenance" criteria, I strayed from Tyler Langlois' blog post because I wanted to avoid the headache of setting up Arch Linux with custom networking configuration and a firewall. So I instead chose to go with [OpenWRT](https://openwrt.org/), a highly-customizable open source Linux distro for embedded devices that's widely used as router firmware. The ESPRESSObin is [natively supported](https://git.openwrt.org/?p=openwrt/openwrt.git;a=commit;h=de3387654b5b65dcd9029d68c8c2fab29f6fef84) by OpenWRT, so it seemed like a good choice to go with. It also helps that OpenWRT acts as a router out of the box - no configuration needed!

Since the ESPRESSObin only has 3 ethernet ports, and you'll need at least 2 of those for your modem and AP, you'll likely need a switch to support all your wired devices. Netgear makes really great networking gear (ha, I just got it!), so I got an 8-port switch from them.

For the WiFi AP, I went with Tyler's suggestion - the [UniFi AC Lite](https://store.ui.com/products/unifi-ac-lite). I've found it to be performant, compact, and highly configurable. These APs are deployed by businesses by the hundreds, so I assumed that getting 1 for my 1-bedroom apartment was good enough.

# Ingredients
1. The [ESPRESSObin board](https://www.amazon.com/gp/product/B07KTMBCS1) - $79
2. A [power adapter](https://www.amazon.com/gp/product/B07KTC9JVB) for the ESPRESSObin - $10
3. A [microSD card](https://www.amazon.com/gp/product/B073K14CVB) to hold the OS - $5.79
4. A [switch](https://www.amazon.com/gp/product/B00MPVR50A) for all your wired devices - $39.99
5. A [WiFi AP](https://www.amazon.com/gp/product/B016K4GQVG) for all your wireless devices - $81.26

Total: $216.04 + sales tax

You'll also want a few ethernet cables to connect everything together. How many depends on how many wired devices you have, but you'll need at least 3 for this setup.

I do realize that this is more expensive than a typical home router, but just like a custom-built PC, it comes with the advantage of being able to swap out individual parts. This becomes useful if, for example, you wanted to eventually support WiFi 6 on your network. With a custom build, you could just buy a WiFi 6 AP instead of a whole WiFi 6 router, all of which currently cost at least $300.

# Setting Up the ESPRESSObin
Setting up the ESPRESSObin with OpenWRT was fairly easy, not counting some (heavy) pitfalls that I experienced that I will explicitly call out here to prevent anyone from making the same mistakes.

## Upgrade the bootloader
First, you'll want to upgrade the bootloader on the ESPRESSObin. Mine came preloaded with an older version that is harder to configure with OpenWRT than the current version (2017.03-armada-17.10). Note that I first followed [these instructions](http://wiki.espressobin.net/tiki-index.php?page=Update+the+Bootloader#USB_stick_or_SD_card) on ESPRESSObin's website, and you can usually refer to their wiki if you get stuck. It's pretty helpful.

For some reason (that a software guy like me can't ever truly understand), the ESPRESSObin can only be accessed via serial port out of the box. I've never used serial ports before, but luckily this wasn't terrible:

1. Plug your ESPRESSObin into a USB port with the included cable
2. Fire up a serial terminal. Note that it will be blank for now and that's expected!

    On macOS, you'll need a driver first that you can get here. After installing the driver and rebooting, you should be able to use this command to get a terminal ready:

    ```
    sudo screen /dev/ttyUSB0 115200 -L
    ```

    If that doesn't work, try running `ls /dev` and find a device that looks like `/dev/ttyUSBX`, where X is a number. You can then use that in the above screen command.

    On Linux, `sudo screen /dev/ttyUSB0 115200` should work without any drivers. The same note applies here as with macOS for finding a non-0 tty device.

    On Windows, you can use PuTTY with a connection type of "Serial", a serial line of "COMX", and a speed of "115200". Replace the X in COMX with the actual serial port that Windows assigns to your board.

3. Plug in your ESPRESSObin's power adapter. If all went well, you should see it booting up in the console!

    You will be able to see your current bootloader version during the boot process. If you're already running U-Boot 2017.03-armada-17.10, you should be able to skip the rest of this section.

When your ESPRESSObin first boots, it will fail to actually boot an OS because, well, there isn't one. So it will flash some errors and drop you into a bootloader prompt that looks like this:

```
Marvell>>
```

Here we can run the commands that let us upgrade the bootloader.

First, download the latest bootloader version from [here](https://espressobin.net/tech-spec/). For the board I bought from Amazon (the one I linked above), you'll want [this specific download](http://espressobin.net/wp-content/uploads/2018/11/ebin-17.10-bootloader.zip).

The zip will contain multiple files. For the Amazon board, you're gonna be using the file named `espressobin-bootloader-cpu-1000-ddr4-1cs-1g-atf-g39a62a1-uboot-g255b9cc-20181107-REL.bin`. **If you flash a bootloader that is incompatible, you will put your board into an unusable state.** [This is recoverable](http://wiki.espressobin.net/tiki-index.php?page=Bootloader+recovery+via+UART), but recovery can be painful.

This happened to me and it took hours to recover from, so I'm hoping that providing these instructions helps someone else not brick their board!

Once you have the correct bootloader file, you'll need to transfer it to the root of an ext4-formatted USB flash drive. Instructions for formatting a flash drive are plentiful and I don't want to reproduce them here for multiple platforms. But [here's one tutorial](http://wiki.espressobin.net/tiki-index.php?page=Update+the+Bootloader#USB_stick_or_SD_card) from ESPRESSObin's website for Linux users. Note that you could technically use a microSD card for this, but it didn't work for me when I tried it.

Next, plug your flash drive into one of the 2 USB ports on the ESPRESSObin, and run these commands to update the bootloader:

```
Marvell>> usb start
Marvell>> bubt espressobin-bootloader-cpu-1000-ddr4-1cs-1g-atf-g39a62a1-uboot-g255b9cc-20181107-REL.bin spi usb
... stuff happens ...
Marvell>> reset
```

Sometimes `bubt` won't find the file on your flash drive. You should try again using the other USB port.

Once the board resets into the bootloader prompt again, you're good to proceed.

## Flash your microSD card with OpenWRT
Next, you'll have to flash the microSD card with an OpenWRT image. I used the excellent [balenaEtcher](https://www.balena.io/etcher/) to flash the microSD card with the current (as of June 2019) release of OpenWRT 18.06.2. You can find OpenWRT releases for the ESPRESSObin [here](https://downloads.openwrt.org/releases/18.06.2/targets/mvebu/cortexa53/). You'll want to flash the `ext4-sdcard` image. All-in-all, this is surprisingly much simpler than making a bootable Windows flash drive in my experience.

## Boot your new router
Once the SD card is flashed, insert it into your ESPRESSObin, hook up the board to your computer via serial connection again, and interrupt the boot process when it asks you to. Run these bootloader commands to let the bootloader know how to load OpenWRT:

```
Marvell>> setenv bootcmd "load mmc 0:1 0x4d00000 boot.scr; source 0x4d00000"
Marvell>> saveenv
Marvell>> reset
```

After resetting, the board should finally boot and you should see the OpenWRT welcome screen!

![welcome screen](https://images.squarespace-cdn.com/content/v1/61bcac49354605783a93d507/784f48a8-c531-4eb8-8447-168ddf880778/Annotation_2019-06-16_181046.png)

# Wiring Everything Together
At this point, your ESPRESSObin is set up and you basically just need to plug stuff in. I won't tell you exactly how to plug everything in, but your setup should look something like this (beautiful) diagram.

![wiring diagram](https://images.squarespace-cdn.com/content/v1/61bcac49354605783a93d507/a2b4d75b-32c8-43da-a249-3a8a19425e28/Untitled+1.png)

## 🚨 ALERT: The ports are not mapped correctly! 🚨
Because of what I assume is a bug with OpenWRT's ESPRESSObin port mappings, the ports on the ESPRESSObin are not what you would expect them to be.

Here is the port layout of the ESPRESSObin v7.

![port layout](https://images.squarespace-cdn.com/content/v1/61bcac49354605783a93d507/fd78ca93-fada-454d-9913-9eb70d3d76ea/Untitled+2.png)

You might expect the WAN port to connect to your modem, and one of the LAN ports would connect to your switch. But that's not how OpenWRT sees it. Instead, **you should connect your modem to the LAN2 port and your switch to the WAN port**. Otherwise the DHCP server won't work correctly and your devices will look like they're connected directly to your modem (that is, assigned an ISP IP address). This will break the network, and you don't want that.

# Setting up OpenWRT
If all went well, you should be able to access OpenWRT from any device connected to your new network at [http://192.168.1.1](http://192.168.1.1). Here, you can set the admin dashboard password and your SSH password (no more serial port!). You can also configure any network settings that you're used to on your current router, and many more that you likely did not know existed.

![OpenWrt admin](https://images.squarespace-cdn.com/content/v1/61bcac49354605783a93d507/b7d124db-8ef2-462d-80b4-a024f82dbb46/InkedUntitled_LI.jpg?format=1000w)

# Setting up your AP
You should now plug your AP into your switch and walk through its setup process. The UniFi comes with a pretty nice network manager app that has a surprisingly user-friendly setup process for a device that's generally meant to be used in a corporate setting.

If you set up the AP with the same SSID and password as your old router's, all your devices should be able to gracefully transition to the new network once your old router is unplugged. I noticed that within a few minutes, everything from my phone to my printer was already talking to the new AP. WiFi's pretty great.

With the UniFi, I had to change the 5G network channel because it was slow at first. Luckily, the UniFi network manager lets you do an RF scan to figure out which channels are crowded, and it lets you switch to a less-crowded channel. I'm surprised that it didn't do this automatically, but at least it gave me a nice way to do it manually.

# Conclusions
I've now been running this new setup for over a week, and my network is as stable as ever. Everything runs just as fast as it did with my Verizon router, which I'll be returning soon. Nothing has ever randomly crashed or slowed down. Video streaming works great on all the usual providers.

![speed](https://images.squarespace-cdn.com/content/v1/61bcac49354605783a93d507/f9527dce-68c9-4229-a29e-db981c78d3e1/Untitled+3.png)

I'll admit that I haven't fully tested all the things that lots of people care about, such as gaming performance. But I'd certainly feel confident trying that out.

Overall, I'm really happy with how this turned out. And most importantly I feel that the itch has indeed been scratched, at least for the moment.

_Thanks for reading! You can find me on Twitter [@irubnich](https://twitter.com/irubnich/). I mostly complain about NYC transit there but I'd love to talk about this stuff as well._

# Addendum: The Pi-hole
Apart from the itch, what really led me to doing this was the success I had with recycling an old Raspberry Pi as a [Pi-hole](https://pi-hole.net/) - a really cool open source project that turns any old Linux machine with an ethernet port into a network-wide ad blocker.

Setting up the Pi-hole motivated me to go deeper into the DIY networking rabbit hole and eventually led me to this whole project. I highly encourage you to check it out.

The Pi-hole makes for a great DHCP server companion to an OpenWRT setup. And it also provides customizable network-wide ad blocking. And it comes with a cool dashboard that lets you see your local network in action! Turns out, on average, almost 20% of my network traffic is ads. I guess I expected that, but it still makes you think.

![Pi-hole dash](https://images.squarespace-cdn.com/content/v1/61bcac49354605783a93d507/b9622f0f-dafa-4963-806c-dfb81efab3bd/Annotation_2019-06-16_165927.png)