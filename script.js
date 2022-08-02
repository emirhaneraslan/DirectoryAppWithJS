

class Kisi {
    constructor(ad,soyad,mail) {
        this.ad=ad
        this.soyad=soyad
        this.mail=mail
    }
}

class Util { //yararlı fonksiyonlar
    static bosAlanKontrolEt (...alanlar) {
        let sonuc =true
        alanlar.forEach(alan => {
            if (alan.length ===0) {
                sonuc=false
                return false
            }
        })
        return sonuc
    }

    //Javascript regex email yazarsan bulursun
    static emailGecerliMi (email) {
        {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
    }
}

class Ekran {
    constructor() {
        this.ad=document.getElementById('ad')
        this.soyad=document.getElementById('soyad')
        this.mail=document.getElementById('mail')
        this.ekleGuncelleButon=document.querySelector('.kaydetGuncelle')
        this.form=document.getElementById('form-rehber')
        this.form.addEventListener('submit',this.kaydetGuncelle.bind(this))
        //this demek zorundayız çünkü global bir fonksiyon değil
        //bind(this) derken ekran objemizi temsil etsin diyoruz.
        //Koymasaydık form-rehberi temsil ederdi.
        this.kisiListesi=document.querySelector('.kisi-listesi')
        this.kisiListesi.addEventListener('click',this.guncelleVeyaSil.bind(this))
        this.depo = new Depo()
        //update ve delete butonşarına basıldığında ilgili tr elemanı burada tutulur
        this.secilenSatir = undefined
        this.kisileriEkranaYazdir()
    }

    bilgiOlustur (mesaj,durum) {
        const uyariDivi=document.querySelector('.bilgi')
        
        uyariDivi.innerHTML=mesaj
        
    
        if (durum) {
            uyariDivi.classList.add('bilgi--success')
        }else {
            uyariDivi.classList.add('bilgi--error')
        }
        /*Kısa if else kullanımı
        olusturulanBilgi.classList.add(durum ? 'bilgi-success' : 'bilgi--error')
        */
    
        //insertBefore: (Ne ekliyeceksin, nereye ekliyeceksin)
        // document.querySelector('.container').insertBefore(olusturulanBilgi,this.form)
    
        //setTimeout(Buraya fonksiyon yaz, Buraya milisaniyeyi yaz): Verdiğimiz süre sonrasında git bu kodu çalıştır demek.
        //setInterval: Verdiğimiz süre doğrultusunda (mesela 2saniye) her 2 saniyede bir kod çalıştırılır. 
        setTimeout(function(){
            uyariDivi.className='bilgi'
            
        },2000)
    }

    alanlariTemizle () {
        this.ad.value=''
        this.soyad.value=''
        this.mail.value=''
    }

    guncelleVeyaSil(e) {
        //console.log(this);
        const tiklanmaYeri = e.target;
        if (tiklanmaYeri.classList.contains('btn--delete')){
            //console.log("Silinecek");
            this.secilenSatir=tiklanmaYeri.parentElement.parentElement
            this.kisiyiEkrandanSil()
        }else if (tiklanmaYeri.classList.contains('btn--edit')){
            //console.log("Güncellenecek");
            this.secilenSatir=tiklanmaYeri.parentElement.parentElement
            this.ekleGuncelleButon.value='GÜNCELLE'
            this.ad.value=this.secilenSatir.cells[0].textContent
            this.soyad.value=this.secilenSatir.cells[1].textContent
            this.mail.value=this.secilenSatir.cells[2].textContent
            

            
        }
    }

    kisiyiEkrandaGuncelle (kisi) {
        
        const sonuc=this.depo.kisiGuncelle(kisi,this.secilenSatir.cells[2].textContent)
        if(sonuc) {
            this.secilenSatir.cells[0].textContent=kisi.ad
            this.secilenSatir.cells[1].textContent=kisi.soyad
            this.secilenSatir.cells[2].textContent=kisi.mail

            this.alanlariTemizle()
            this.secilenSatir=undefined
            this.ekleGuncelleButon.value= 'KAYDET'
            this.bilgiOlustur('Kişi güncellendi',true)
        }else {
            this.bilgiOlustur('Yazdığınız mail kullanımda',false)
        }
    }

    kisiyiEkrandanSil () {
        this.secilenSatir.remove()
        const silinecekMail = this.secilenSatir.cells[2].textContent
        this.depo.kisiSil(silinecekMail)
        this.alanlariTemizle()
        this.secilenSatir=undefined
        this.bilgiOlustur('Kişi rehberden silindi',true)
    }

    kisileriEkranaYazdir() {
        this.depo.tumKisiler.forEach(kisi =>{
            this.kisiyiEkranaEkle(kisi)
        })
    }

    kaydetGuncelle(e) {
        e.preventDefault()
        
        /*console.log(this);

        <form id="form-rehber" action="">
            <div>
                <label for="ad">Adı</label>
                <input type="text" id="ad" class="u-full-width">
            </div>
            <div>
                <label for="soyad">Soyadı</label>
                <input type="text" id="soyad" class="u-full-width">
            </div>
            <div>
                <label for="mail">Email</label>
                <input type="text" id="mail" class="u-full-width">
            </div>
            <div>
                <input type="submit" class="button-primary u-full-width kaydetGuncelle" value="Kaydet">
            </div>
        </form>
        */

        /*
        console.log(this.ad);
        //<input type="text" id="ad" class="u-full-width">
        console.log(this.soyad);
        //<input type="text" id="soyad" class="u-full-width">
        */

        const kisi = new Kisi(this.ad.value,this.soyad.value,this.mail.value)
        const sonuc=Util.bosAlanKontrolEt(kisi.ad,kisi.soyad,kisi.mail)
        const emailGecerliMi = Util.emailGecerliMi(this.mail.value)
        console.log(emailGecerliMi);

        if (sonuc) {//Tüm alanlar doldurulmuş ise girer if'e
            //console.log("Başarılı");

            if (!emailGecerliMi) {
                this.bilgiOlustur('Geçerli bir mail yazınız.',false)
                return
            }

            if(this.secilenSatir) { //secilen satır undefined değil ise güncellenecektir. 
                this.kisiyiEkrandaGuncelle(kisi)

            }else { //seçilen satır undefined ise ekleme yapılacaktır.
            
            //LocalStorageye ekle
            const sonuc = this.depo.kisiEkle(kisi)

            if(sonuc) {
                this.bilgiOlustur('Başarıyla Eklendi',true)
                //yeni kişiyi ekrana ekler
                this.kisiyiEkranaEkle(kisi)
                this.alanlariTemizle()
            }else {
                this.bilgiOlustur('Bu Mail Kullanımda',false)
            }
        }
            
            

        }else {//Bazı alanlar eksik
            //console.log("Boş alan var");
            this.bilgiOlustur('Boş alanları doldurunuz',false)
        }
    }

    kisiyiEkranaEkle(kisi) {
        const olusturulanTR = document.createElement('tr')
        olusturulanTR.innerHTML=`<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td>
            <button class="btn btn--edit"><i class="far fa-edit"></i></button>
            <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
        </td>`

        this.kisiListesi.appendChild(olusturulanTR)
        
    }

}

class Depo {
    //Uygulama ilk açıldığında veriler getirilir.
    
    constructor(){
        this.tumKisiler = this.kisileriGetir()
    }

    emailEssizMi(mail) {
        const sonuc=this.tumKisiler.find(kisi => {
            return kisi.mail ===mail
        })
        if(sonuc) {//demekki bu maili kullanan biri var.
            console.log(mail +" kullanımda");
            return false
        }else {
            console.log(mail +" kullanımda değil ekleme güncelleme yapılabilir");
            return true
        }
    }
    kisileriGetir () {
        //tumKisilerLocal sadece fonksiyon içinde geçerli
        let tumKisilerLocal
        if(localStorage.getItem('tumKisiler')===null) {
            tumKisilerLocal = []
        }else {
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'))
        }
        return tumKisilerLocal
    }

    kisiEkle(kisi) {

        if (this.emailEssizMi(kisi.mail)) {
            this.tumKisiler.push(kisi)
            localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler))
            /*2. seçenek
            const tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'))
            */
           return true
        }else {
            return false
        }
         
    }

    kisiSil(mail) {
        this.tumKisiler.forEach((kisi,index) => {
            if(kisi.mail.trim() ===mail.trim()) {
                this.tumKisiler.splice(index,1)
            }
        })
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler))
    }

    //Güncellenmiş kişi yeni değerleri içerir
    //Mail kişinin veritabanında bulunması için gerekli olan eski mailini içerir.
    kisiGuncelle(guncellenmisKisi,mail) {

        if(guncellenmisKisi.mail ===mail) {
            this.tumKisiler.forEach((kisi,index) => {
                if(kisi.mail ===mail) {
                    this.tumKisiler[index] =guncellenmisKisi
                    localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler))
                    return true
                }
            })
            return true
        }

        if(this.emailEssizMi(guncellenmisKisi.mail)){
            console.log(guncellenmisKisi.mail+" için kontrol yapılıyor ve sonuc: güncelleme yapabilirsin");

            this.tumKisiler.forEach((kisi,index) => {
                if(kisi.mail ===mail) {
                    this.tumKisiler[index] =guncellenmisKisi
                    localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler))
                    return true
                }
            })
            return true
            
        } else {
            console.log(guncellenmisKisi.mail+"Bu mail kullanımda. Güncelleme yapılamaz");
            return false
        }
       
    }
}

//Bunu yapınca ekran class'ına gidecek
document.addEventListener('DOMContentLoaded',function(){
    const ekran = new Ekran()
})

