/*
 * Copyright 2015, KNX-User-Forum e.V.
 * 
 *     This file is part of xxAPI2.
 * 
 *     xxAPI2 is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Lesser General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 * 
 *     xxAPI2 is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Lesser General Public License for more details.
 * 
 *     You should have received a copy of the GNU Lesser General Public License
 *     along with xxAPI2.  If not, see <http://www.gnu.org/licenses/>.
 * 
 *     Diese Datei ist Teil von xxAPI2.
 * 
 *     xxAPI2 ist Freie Software: Sie können es unter den Bedingungen
 *     der GNU Lesser General Public License, wie von der Free Software Foundation,
 *     Version 3 der Lizenz oder (nach Ihrer Wahl) jeder späteren
 *     veröffentlichten Version, weiterverbreiten und/oder modifizieren.
 * 
 *     xxAPI2 wird in der Hoffnung, dass es nützlich sein wird, aber
 *     OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
 *     Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
 *     Siehe die GNU Lesser General Public License für weitere Details.
 * 
 *     Sie sollten eine Kopie der GNU Lesser General Public License zusammen mit diesem
 *     Programm erhalten haben. Wenn nicht, siehe <http://www.gnu.org/licenses/>.

 * https://github.com/knxuf/xxAPI2/blob/master/LICENSE
 *
 * arguments are
 *   oarg.args an Array containing the arguments seperated by * starting with oarg.args[0] the function name itself
 *      XXMYCUSTOMFUNCTION*option=23*Some Text
 *          oarg.args[0] = "XXMYCUSTOMFUNCTION"
 *          oarg.args[1] = "option=23"
 *          oarg.args[2] = "Some Text"
 *
 *    oarg.item is the item Object before the item is created as an HTML Object
 *      .type is one of BOX|TXT|ICO|GRAF|CAM
 *      .width .height .top .left Postion and Size
 *      .text is the full Text
 *      .color is the Textcolor
 *      .bgcolor is the Backgroundcolor
 *      .image is the ImageID
 *      .url is the URL 
 *      .html is a write only Variable that can be filled with custom HTML code that is applied instead of .text
 *      .click is a binary Variable that can be set to enable/disable click Handler
 *      .action_id is a numeric Value that hold the Homeserver Action for this item
 *         (0 = Nur Befehl, 1 = Seitenaufruf (optional Befehl), 7 = Kamera, 8 = Wochenschaltuhr, 9 = Werteingabe, 10 = Urlaubskalender,
 *         11 = Feiertagskalender, 12 = Datum/Uhrzeit setzen,, 14 = Meldungsarchiv, , 15 = Buddy, 16 = Diagramm, 17 = Kamera-Archiv, 
 *         18 = Universal Zeitschaltuhr,20 = Seite aktualisieren, 21 = Navigation: Startseite, 22 = Navigation: Zurück, 23 = Menü,
 *         24 = Query, 25 = Navigation: Beenden)
 *      .open_page is the ID for the Page to open
 *      .font is the Font ID
 *      .align is 1=left 2=center 3=right
 *      .customcss is an Javascript Object that is applied to the HTML Object after the creation
 *      .hidden is a boolean when set to true the item is not appended to the Page
 *
 *    oarg.item.page is the Page Object
 *      .width .height Page size
 *      .bg_image is the Page Background Image
 *      .popup is a boolean to make this page a popup
 *      .hidden is a boolean when set to true the Page is not appended to HTML
 *
*/

"use strict";
xxAPI.functions.XXMYOWNCUSTOMFUNCTION = function( oarg ) {
    oarg.item.text = '';
}
