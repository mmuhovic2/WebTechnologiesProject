let Raspored = (function () {

  const satText = [
    "00:00",
    "",
    "02:00",
    "",
    "04:00",
    "",
    "06:00",
    "",
    "08:00",
    "",
    "10:00",
    "",
    "12:00",
    "",
    "",
    "15:00",
    "",
    "17:00",
    "",
    "19:00",
    "",
    "21:00",
    "",
    "23:00",
    "",
  ];

  const vratiStringSata = function (sat) {
    let string = ""
    sat < 10 ? string = "0" + sat.toString() + ":00" : string = sat.toString() + ":00";
    return string;
  }

  const vratiVrijeme = function (tabela) {
    let red = tabela.rows[0];
    let brojKolona = 0;
    let pocetni = parseInt(red.cells[1].innerHTML.split(":")[0]);
    for (let i = 0; i < red.cells.length; i++) {
      brojKolona += red.cells[i].colSpan;
    }
    return [pocetni, (brojKolona - 8) / 2 + pocetni];
  }

  const provjeriPoklapanje = function (red, satPocetak, vrijemePocetak, vrijemeKraj) {
    let pocetak = 2 * (vrijemePocetak - satPocetak);
    let trajanje = 2 * (vrijemeKraj - vrijemePocetak);
    let brojac = 0;
    for (let i = 1; i < red.cells.length; i++) {
      if ((brojac < pocetak && brojac + red.cells[i].colSpan > pocetak) || (brojac >= pocetak && brojac < pocetak + trajanje && red.cells[i].innerHTML != "")) return true;
      brojac += red.cells[i].colSpan;
    }
    return false;
  }

  const popraviStil = function (red) {
    let brojac = 0;
    for (let i = 1; i < red.cells.length; i++) {
      if (brojac % 2 == 0 && red.cells[i].colSpan % 2 == 0) red.cells[i].setAttribute("class", "prvaTD");
      if (brojac % 2 == 0 && red.cells[i].colSpan % 2 == 1) red.cells[i].setAttribute("class", "drugaTD");
      if (brojac % 2 == 1 && red.cells[i].colSpan % 2 == 0) red.cells[i].setAttribute("class", "cetvrtaTD");
      if (brojac % 2 == 1 && red.cells[i].colSpan % 2 == 1) red.cells[i].setAttribute("class", "trecaTD");
      brojac += red.cells[i].colSpan;
    }
  }

  const provjeriDan = function (tabela, dan) {
    for (let i = 1; i < tabela.rows.length; i++) {
      if (dan === tabela.rows[i].cells[0].textContent) return [true, i];
    }
    return [false];
  }

  let iscrtajRaspored = function (div, dani, satPocetak, satKraj) {
    if (satPocetak >= satKraj || satPocetak < 0 || satPocetak > 24 || satKraj < 0 || satKraj > 24 || Number.isInteger(satPocetak) == false || Number.isInteger(satKraj) == false || dani.length == 0) {
      console.log(div);
      div.innerHTML = "Greška!";
    } else {
      div.innerHTML="";
      let brojDana = dani.length;
      let brojSati = satKraj - satPocetak;

      let tabel = document.createElement("table");
      let tr = document.createElement("tr");

      let brojacSati = satPocetak;
      for (let i = 0; i < brojSati + 1; i++) {
        let th = document.createElement("th");

        if (i == 0) {
          th.setAttribute("colspan", 7);
          th.appendChild(document.createTextNode(""));
        } else {
          th.setAttribute("colspan", 2);
          if (i == 1) th.appendChild(document.createTextNode(vratiStringSata(satPocetak)));
          else th.appendChild(document.createTextNode(satText[brojacSati - 1]));
        }
        tr.appendChild(th);
        if (i == brojSati) {
          th = document.createElement("th");
          th.setAttribute("colspan", 2 * brojSati + 8 - (7 + 2 * brojSati));
          tr.appendChild(th);
        }
        brojacSati = brojacSati + 1;
      }
      tabel.appendChild(tr);

      for (let i = 0; i < brojDana; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < 2 * brojSati + 1; j++) {
          let td = document.createElement("td");
          if (j == 0) {
            td.appendChild(document.createTextNode(dani[i]));
            td.setAttribute("colspan", 8);
          }
          tr.appendChild(td);
        }
        tabel.appendChild(tr);
      }

      div.appendChild(tabel);
    }
  }

  let dodajAktivnost = function (raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan) {
    if (raspored == null || raspored.getElementsByTagName("table")[0] == undefined) {
      alert("Greška - raspored nije kreiran");
      return false;
    } else {

      let tabela = raspored.getElementsByTagName("table")[0];
      let satiRaspored = vratiVrijeme(tabela);
      let danRed = provjeriDan(tabela, dan);

      if (danRed[0] == false || vrijemePocetak < satiRaspored[0] || vrijemeKraj > satiRaspored[1] || vrijemeKraj <= vrijemePocetak || Number.isInteger(2 * vrijemePocetak) == false || Number.isInteger(2 * vrijemeKraj) == false) {

        alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
        return false;
      } else if (provjeriPoklapanje(tabela.rows[danRed[1]], satiRaspored[0], vrijemePocetak, vrijemeKraj)) {
        alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
        return false;
      } else {

        let pocetak = 2 * (vrijemePocetak - satiRaspored[0]);
        let trajanje = 2 * (vrijemeKraj - vrijemePocetak);
        let red = tabela.rows[danRed[1]];
        let i = 1;
        let j = 0
        for (i; i < red.cells.length; i++) {
          if (j == pocetak) break;
          j += red.cells[i].colSpan;
        }
        red.cells[i].innerHTML = naziv + "<br>" + tip;
        red.cells[i].setAttribute("colspan", trajanje);
        i++;
        trajanje--;
        while (trajanje) {
          red.deleteCell(i);
          trajanje--;
        }
        popraviStil(tabela.rows[danRed[1]]);
        return true;
      }
    }
  }
  return {
    iscrtajRaspored: iscrtajRaspored,
    dodajAktivnost: dodajAktivnost
  }
}());